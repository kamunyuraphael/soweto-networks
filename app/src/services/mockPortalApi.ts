import { PACKAGES } from '@/models/catalog'
import type { PaymentStatus } from '@/models/payment'
import type { Session } from '@/models/session'
import { ApiError, type PortalApi } from './portalApi'

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const minutesFromNow = (m: number) => new Date(Date.now() + m * 60_000).toISOString()

type Outcome = PaymentStatus | 'never'

/**
 * Rehearse every screen without a backend.
 *
 * M-Pesa number, by its last digits:
 *   ...0000 cancelled    ...1111 wrong PIN    ...2222 no M-Pesa balance
 *   ...3333 never answers (timeout)           ...4444 paid, but login fails once
 *   anything else: succeeds after about 6 seconds.
 *
 * Reconnect (voucher / M-Pesa code):  ...0000 not found,  ...9999 used or expired.
 * Reconnect (username / password):    password "wrong" is rejected, username "expired" is expired.
 *
 * URL flag: add ?down to see the red service banner.
 */
function outcomeFor(phone: string): Outcome {
  if (phone.endsWith('0000')) return 'cancelled'
  if (phone.endsWith('1111')) return 'wrong_pin'
  if (phone.endsWith('2222')) return 'insufficient_funds'
  if (phone.endsWith('3333')) return 'never'
  return 'success'
}

export function createMockPortalApi(): PortalApi {
  const payments = new Map<string, { packageId: string; phone: string; resolveAt: number }>()
  let counter = 0
  let activationAttempts = 0

  return {
    async getStatus() {
      await sleep(250)
      const down = new URLSearchParams(window.location.search).has('down')
      return {
        notice: down ? 'The network service is not responding. Please try again in a few minutes.' : null,
      }
    },

    async startTrial() {
      await sleep(900)
      return { packageName: 'Free trial', expiresAt: minutesFromNow(3) }
    },

    async requestPayment({ packageId, phone }) {
      await sleep(700)
      const paymentId = `mock-${++counter}`
      payments.set(paymentId, { packageId, phone, resolveAt: Date.now() + 6000 })
      return { paymentId }
    },

    async getPaymentStatus(paymentId) {
      await sleep(200)
      const payment = payments.get(paymentId)
      if (!payment) throw new ApiError('Unknown payment', 'not_found')
      const outcome = outcomeFor(payment.phone)
      if (outcome === 'never' || Date.now() < payment.resolveAt) return 'pending'
      return outcome
    },

    async activatePackage(paymentId) {
      await sleep(800)
      const payment = payments.get(paymentId)
      if (!payment) throw new ApiError('Unknown payment', 'not_found')
      if (payment.phone.endsWith('4444') && activationAttempts++ === 0) {
        throw new ApiError('Hotspot login failed', 'activation_failed')
      }
      const pkg = PACKAGES.find((p) => p.id === payment.packageId)
      const session: Session = {
        packageName: pkg?.name ?? 'Package',
        expiresAt: minutesFromNow(pkg?.durationMinutes ?? 60),
      }
      return session
    },

    async login(input) {
      await sleep(800)
      if (input.method === 'credentials') {
        if (input.username === 'expired') throw new ApiError('Package ended', 'used_or_expired')
        if (input.password === 'wrong') throw new ApiError('Bad credentials', 'invalid_credentials')
        return { packageName: '24 HRS', expiresAt: minutesFromNow(6 * 60) }
      }
      if (input.code.endsWith('0000')) throw new ApiError('Not found', 'not_found')
      if (input.code.endsWith('9999')) throw new ApiError('Used or expired', 'used_or_expired')
      return {
        packageName: input.method === 'voucher' ? '12 hrs' : '24 HRS',
        expiresAt: minutesFromNow(input.method === 'voucher' ? 12 * 60 : 6 * 60),
      }
    },
  }
}
