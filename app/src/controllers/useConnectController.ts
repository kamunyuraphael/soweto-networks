import { useCallback, useEffect, useReducer } from 'react'
import { site } from '@/config/site'
import { PACKAGE_GROUPS } from '@/models/catalog'
import type { Package } from '@/models/package'
import { formatLocal, normalizeKenyanMsisdn } from '@/lib/phone'
import { loadSavedMsisdn, saveMsisdn } from '@/lib/storage'
import { ApiError, type PortalApi } from '@/services/portalApi'
import { connectReducer, initialConnectState } from './connectReducer'
import { usePortalNotice } from './usePortalNotice'

const savedPhoneForForm = () => {
  const saved = loadSavedMsisdn()
  return saved ? formatLocal(saved) : ''
}

/**
 * Controller: owns the journey state and every side effect (API calls,
 * polling, storage). Views receive `state` and call `actions`; they never
 * talk to the API themselves.
 */
export function useConnectController(api: PortalApi) {
  const [state, dispatch] = useReducer(connectReducer, initialConnectState)
  const notice = usePortalNotice(api)

  const finishActivation = useCallback(
    async (paymentId: string) => {
      try {
        const session = await api.activatePackage(paymentId)
        dispatch({ type: 'CONNECTED', session })
      } catch {
        dispatch({
          type: 'FAILED',
          reason: 'activation_failed',
          retry: { kind: 'activate', paymentId },
        })
      }
    },
    [api],
  )

  const startTrial = useCallback(async () => {
    dispatch({ type: 'CONNECTING' })
    try {
      const session = await api.startTrial()
      dispatch({ type: 'CONNECTED', session })
    } catch {
      dispatch({ type: 'FAILED', reason: 'network', retry: { kind: 'trial' } })
    }
  }, [api])

  // Poll for the M-Pesa result while the customer is entering their PIN.
  // Keyed on paymentId only, so moving from the "pin" step to "connecting"
  // doesn't restart it; "Resend" issues a new paymentId and does.
  const waitingPaymentId = state.status === 'waiting' ? state.paymentId : null
  useEffect(() => {
    if (state.status !== 'waiting' || !waitingPaymentId) return
    const { paymentId, pkg, msisdn, startedAt } = state
    const retryPay = { kind: 'pay', pkg, msisdn } as const
    let active = true
    let timer: ReturnType<typeof setTimeout> | undefined

    const tick = async () => {
      if (Date.now() - startedAt > site.payment.timeoutMs) {
        dispatch({ type: 'FAILED', reason: 'timeout', retry: retryPay })
        return
      }
      try {
        const status = await api.getPaymentStatus(paymentId)
        if (!active) return
        if (status === 'pending') {
          timer = setTimeout(tick, site.payment.pollIntervalMs)
        } else if (status === 'success') {
          dispatch({ type: 'PAYMENT_CONFIRMED' })
          await finishActivation(paymentId)
        } else {
          dispatch({ type: 'FAILED', reason: status, retry: retryPay })
        }
      } catch {
        if (active) dispatch({ type: 'FAILED', reason: 'network', retry: retryPay })
      }
    }

    timer = setTimeout(tick, site.payment.pollIntervalMs)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [waitingPaymentId, api, finishActivation])

  const choosePackage = useCallback(
    (pkg: Package) => {
      if (pkg.priceKsh === 0) {
        void startTrial()
        return
      }
      dispatch({ type: 'PACKAGE_CHOSEN', pkg, phone: savedPhoneForForm() })
    },
    [startTrial],
  )

  const requestPrompt = useCallback(
    async (pkg: Package, msisdn: string) => {
      try {
        const { paymentId } = await api.requestPayment({ packageId: pkg.id, phone: msisdn })
        dispatch({ type: 'PROMPT_SENT', paymentId, now: Date.now() })
      } catch {
        dispatch({
          type: 'FAILED',
          reason: 'prompt_failed',
          retry: { kind: 'pay', pkg, msisdn },
        })
      }
    },
    [api],
  )

  const submitPayment = useCallback(
    async (rawPhone: string) => {
      if (state.status !== 'paying') return
      const msisdn = normalizeKenyanMsisdn(rawPhone)
      if (!msisdn) {
        dispatch({
          type: 'PHONE_INVALID',
          message: 'Enter your M-Pesa number, like 0712 345 678.',
        })
        return
      }
      saveMsisdn(msisdn)
      dispatch({ type: 'PAYMENT_REQUESTED', msisdn })
      await requestPrompt(state.pkg, msisdn)
    },
    [state, requestPrompt],
  )

  const resendPrompt = useCallback(async () => {
    if (state.status !== 'waiting' || state.step !== 'pin') return
    await requestPrompt(state.pkg, state.msisdn)
  }, [state, requestPrompt])

  const retry = useCallback(() => {
    if (state.status !== 'failed') return
    const { retry: target } = state
    switch (target.kind) {
      case 'pay':
        dispatch({ type: 'PACKAGE_CHOSEN', pkg: target.pkg, phone: formatLocal(target.msisdn) })
        break
      case 'trial':
        void startTrial()
        break
      case 'activate':
        dispatch({ type: 'CONNECTING' })
        void finishActivation(target.paymentId)
        break
    }
  }, [state, startTrial, finishActivation])

  const openLogin = useCallback(() => {
    dispatch({ type: 'LOGIN_OPENED', phone: savedPhoneForForm() })
  }, [])

  const submitLogin = useCallback(
    async (rawPhone: string) => {
      const msisdn = normalizeKenyanMsisdn(rawPhone)
      if (!msisdn) {
        dispatch({ type: 'LOGIN_ERROR', message: 'Enter the M-Pesa number you paid with.' })
        return
      }
      dispatch({ type: 'LOGIN_SUBMITTING' })
      try {
        const session = await api.loginWithPhone(msisdn)
        saveMsisdn(msisdn)
        dispatch({ type: 'CONNECTED', session })
      } catch (error) {
        const notFound = error instanceof ApiError && error.code === 'not_found'
        dispatch({
          type: 'LOGIN_ERROR',
          message: notFound
            ? "We couldn't find an active package for that number."
            : "Couldn't reach the network. Try again.",
        })
      }
    },
    [api],
  )

  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return {
    state,
    notice,
    groups: PACKAGE_GROUPS,
    actions: {
      choosePackage,
      startTrial,
      submitPayment,
      resendPrompt,
      retry,
      openLogin,
      submitLogin,
      reset,
    },
  }
}

export type ConnectController = ReturnType<typeof useConnectController>
