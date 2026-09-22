import { useCallback, useEffect, useReducer } from 'react'
import { site } from '@/config/site'
import { PACKAGES } from '@/models/catalog'
import {
  isLoginInputValid,
  normalizeLoginInput,
  type LoginError,
  type LoginInput,
  type LoginMethod,
} from '@/models/login'
import type { Package } from '@/models/package'
import { formatLocal, normalizeKenyanMsisdn } from '@/lib/phone'
import { loadSavedMsisdn, saveMsisdn } from '@/lib/storage'
import { ApiError, type PortalApi } from '@/services/portalApi'
import { initialPortalState, portalReducer } from './portalReducer'
import { usePortalNotice } from './usePortalNotice'

const savedPhoneForForm = () => {
  const saved = loadSavedMsisdn()
  return saved ? formatLocal(saved) : ''
}

function toLoginError(error: unknown): LoginError {
  if (error instanceof ApiError) {
    if (error.code === 'not_found') return 'not_found'
    if (error.code === 'used_or_expired') return 'used_or_expired'
    if (error.code === 'invalid_credentials') return 'invalid_credentials'
  }
  return 'network'
}

/**
 * Controller: owns the journey state and every side effect (API calls,
 * polling, storage). Views receive `state` and call `actions`; they never
 * talk to the API themselves.
 */
export function usePortalController(api: PortalApi) {
  const [state, dispatch] = useReducer(portalReducer, initialPortalState)
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

  // Poll for the M-Pesa result while the customer enters their PIN.
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

  const choosePackage = useCallback((pkg: Package) => {
    dispatch({ type: 'PACKAGE_CHOSEN', pkg, phone: savedPhoneForForm() })
  }, [])

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
        dispatch({ type: 'PHONE_INVALID' })
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

  const submitLogin = useCallback(
    async (rawInput: LoginInput) => {
      if (state.status !== 'login') return
      const input = normalizeLoginInput(rawInput)
      if (!isLoginInputValid(input)) {
        dispatch({ type: 'LOGIN_ERROR', error: 'invalid_input' })
        return
      }
      dispatch({ type: 'LOGIN_SUBMITTING' })
      try {
        const session = await api.login(input)
        dispatch({ type: 'CONNECTED', session })
      } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: toLoginError(error) })
      }
    },
    [api, state.status],
  )

  const openReconnect = useCallback(() => dispatch({ type: 'RECONNECT_OPENED' }), [])
  const chooseLoginMethod = useCallback(
    (method: LoginMethod) => dispatch({ type: 'LOGIN_METHOD_CHOSEN', method }),
    [],
  )
  const openTv = useCallback(() => dispatch({ type: 'TV_OPENED' }), [])
  const close = useCallback(() => dispatch({ type: 'CLOSED' }), [])

  return {
    state,
    notice,
    packages: PACKAGES,
    actions: {
      choosePackage,
      startTrial,
      submitPayment,
      resendPrompt,
      retry,
      openReconnect,
      chooseLoginMethod,
      submitLogin,
      openTv,
      close,
    },
  }
}

export type PortalController = ReturnType<typeof usePortalController>
