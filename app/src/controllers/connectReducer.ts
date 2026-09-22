import type { Package } from '@/models/package'
import type { FailureReason } from '@/models/payment'
import type { Session } from '@/models/session'

/** What the "Try again" button on the failure screen should do. */
export type RetryTarget =
  | { kind: 'pay'; pkg: Package; msisdn: string }
  | { kind: 'trial' }
  | { kind: 'activate'; paymentId: string }

/**
 * The whole customer journey as one state machine:
 *
 *   choosing -> paying -> requesting -> waiting(pin -> connecting) -> connected
 *        |         ^                              |
 *        +-> login |                              +-> failed
 *
 * Each state carries only the data that screen needs, so impossible
 * combinations (e.g. "waiting" with no payment id) can't be represented.
 */
export type ConnectState =
  | { status: 'choosing' }
  | { status: 'paying'; pkg: Package; phone: string; error: string | null }
  | { status: 'requesting'; pkg: Package; msisdn: string }
  | {
      status: 'waiting'
      step: 'pin' | 'connecting'
      pkg: Package
      msisdn: string
      paymentId: string
      startedAt: number
    }
  | { status: 'connecting' }
  | { status: 'connected'; session: Session }
  | { status: 'failed'; reason: FailureReason; retry: RetryTarget }
  | { status: 'login'; phone: string; error: string | null; submitting: boolean }

export type ConnectAction =
  | { type: 'PACKAGE_CHOSEN'; pkg: Package; phone: string }
  | { type: 'PHONE_INVALID'; message: string }
  | { type: 'PAYMENT_REQUESTED'; msisdn: string }
  | { type: 'PROMPT_SENT'; paymentId: string; now: number }
  | { type: 'PAYMENT_CONFIRMED' }
  | { type: 'CONNECTING' }
  | { type: 'CONNECTED'; session: Session }
  | { type: 'FAILED'; reason: FailureReason; retry: RetryTarget }
  | { type: 'LOGIN_OPENED'; phone: string }
  | { type: 'LOGIN_SUBMITTING' }
  | { type: 'LOGIN_ERROR'; message: string }
  | { type: 'RESET' }

export const initialConnectState: ConnectState = { status: 'choosing' }

export function connectReducer(state: ConnectState, action: ConnectAction): ConnectState {
  switch (action.type) {
    case 'PACKAGE_CHOSEN':
      return { status: 'paying', pkg: action.pkg, phone: action.phone, error: null }

    case 'PHONE_INVALID':
      return state.status === 'paying' ? { ...state, error: action.message } : state

    case 'PAYMENT_REQUESTED':
      return state.status === 'paying'
        ? { status: 'requesting', pkg: state.pkg, msisdn: action.msisdn }
        : state

    case 'PROMPT_SENT':
      // Also handles "Resend": a fresh prompt replaces the waiting one.
      return state.status === 'requesting' || state.status === 'waiting'
        ? {
            status: 'waiting',
            step: 'pin',
            pkg: state.pkg,
            msisdn: state.msisdn,
            paymentId: action.paymentId,
            startedAt: action.now,
          }
        : state

    case 'PAYMENT_CONFIRMED':
      return state.status === 'waiting' ? { ...state, step: 'connecting' } : state

    case 'CONNECTING':
      return { status: 'connecting' }

    case 'CONNECTED':
      return { status: 'connected', session: action.session }

    case 'FAILED':
      return { status: 'failed', reason: action.reason, retry: action.retry }

    case 'LOGIN_OPENED':
      return { status: 'login', phone: action.phone, error: null, submitting: false }

    case 'LOGIN_SUBMITTING':
      return state.status === 'login' ? { ...state, submitting: true, error: null } : state

    case 'LOGIN_ERROR':
      return state.status === 'login' ? { ...state, submitting: false, error: action.message } : state

    case 'RESET':
      return initialConnectState
  }
}
