import type { LoginInput } from '@/models/login'
import type { PaymentStatus } from '@/models/payment'
import type { Session } from '@/models/session'

export interface PortalStatus {
  /** Message for the red banner at the top of the page, or null when all is well. */
  notice: string | null
}

/**
 * The contract between the portal UI and your backend.
 * Implement it over HTTP (httpPortalApi) or in memory (mockPortalApi).
 */
export interface PortalApi {
  getStatus(): Promise<PortalStatus>
  startTrial(): Promise<Session>
  /** Sends the M-Pesa prompt (STK push) to the customer's phone. */
  requestPayment(input: { packageId: string; phone: string }): Promise<{ paymentId: string }>
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>
  /** Logs the device into the hotspot once payment succeeded. */
  activatePackage(paymentId: string): Promise<Session>
  /**
   * Reconnect with a voucher, an M-Pesa transaction code, or a username and password.
   * Reject with ApiError code 'not_found' | 'used_or_expired' | 'invalid_credentials'.
   */
  login(input: LoginInput): Promise<Session>
}

export class ApiError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}
