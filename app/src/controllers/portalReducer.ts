import type { DeviceRef } from '@/models/device'
import type { LoginError, LoginMethod } from '@/models/login'
import type { Package } from '@/models/package'
import type { FailureReason } from '@/models/payment'
import type { Session } from '@/models/session'

/** What "Try again" on the failure dialog should do. */
export type RetryTarget =
  | { kind: 'pay'; pkg: Package; msisdn: string; device?: DeviceRef }
  | { kind: 'trial' }
  | { kind: 'activate'; paymentId: string }

/**
 * The portal is one page with at most one dialog on top. `status` says which
 * dialog (if any) is open. Each state carries only what its dialog needs, so
 * impossible combinations can't be represented.
 *
 *   idle -> paying -> requesting -> waiting(pin -> connecting) -> connected
 *     |        ^                          |
 *     |        +------ Try again --------+-> failed
 *     +-> reconnect -> login(method) -> connected
 *     +-> tvIntro -> tvPickDevice \
 *                 -> tvManualMac   +-> tvChoosePackage -> paying (device attached) -> ...
 *
 * `paying` / `requesting` / `waiting` carry an optional `device`: set when
 * the customer is buying a plan for a TV or other device added via
 * "Add a TV or device", rather than for the browsing phone itself.
 */
export type PortalState =
  | { status: 'idle' }
  | { status: 'paying'; pkg: Package; phone: string; error: 'invalid_phone' | null; device?: DeviceRef }
  | { status: 'requesting'; pkg: Package; msisdn: string; device?: DeviceRef }
  | {
      status: 'waiting'
      step: 'pin' | 'connecting'
      pkg: Package
      msisdn: string
      paymentId: string
      startedAt: number
      device?: DeviceRef
    }
  | { status: 'connecting' }
  | { status: 'connected'; session: Session }
  | { status: 'failed'; reason: FailureReason; retry: RetryTarget }
  | { status: 'reconnect' }
  | { status: 'login'; method: LoginMethod; error: LoginError | null; submitting: boolean }
  | { status: 'tvIntro' }
  | { status: 'tvPickDevice' }
  | { status: 'tvManualMac'; error: 'invalid_mac' | null }
  | { status: 'tvChoosePackage'; device: DeviceRef }

export type PortalAction =
  | { type: 'PACKAGE_CHOSEN'; pkg: Package; phone: string; device?: DeviceRef }
  | { type: 'PHONE_INVALID' }
  | { type: 'PAYMENT_REQUESTED'; msisdn: string }
  | { type: 'PROMPT_SENT'; paymentId: string; now: number }
  | { type: 'PAYMENT_CONFIRMED' }
  | { type: 'CONNECTING' }
  | { type: 'CONNECTED'; session: Session }
  | { type: 'FAILED'; reason: FailureReason; retry: RetryTarget }
  | { type: 'RECONNECT_OPENED' }
  | { type: 'LOGIN_METHOD_CHOSEN'; method: LoginMethod }
  | { type: 'LOGIN_SUBMITTING' }
  | { type: 'LOGIN_ERROR'; error: LoginError }
  | { type: 'TV_INTRO_OPENED' }
  | { type: 'TV_PICK_OPENED' }
  | { type: 'TV_MANUAL_OPENED' }
  | { type: 'MAC_INVALID' }
  | { type: 'DEVICE_CHOSEN'; device: DeviceRef }
  | { type: 'CLOSED' }

export const initialPortalState: PortalState = { status: 'idle' }

export function portalReducer(state: PortalState, action: PortalAction): PortalState {
  switch (action.type) {
    case 'PACKAGE_CHOSEN':
      return { status: 'paying', pkg: action.pkg, phone: action.phone, error: null, device: action.device }

    case 'PHONE_INVALID':
      return state.status === 'paying' ? { ...state, error: 'invalid_phone' } : state

    case 'PAYMENT_REQUESTED':
      return state.status === 'paying'
        ? { status: 'requesting', pkg: state.pkg, msisdn: action.msisdn, device: state.device }
        : state

    case 'PROMPT_SENT':
      // Also handles "Resend": a fresh prompt replaces the one being waited on.
      return state.status === 'requesting' || state.status === 'waiting'
        ? {
            status: 'waiting',
            step: 'pin',
            pkg: state.pkg,
            msisdn: state.msisdn,
            paymentId: action.paymentId,
            startedAt: action.now,
            device: state.device,
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

    case 'RECONNECT_OPENED':
      return { status: 'reconnect' }

    case 'LOGIN_METHOD_CHOSEN':
      return { status: 'login', method: action.method, error: null, submitting: false }

    case 'LOGIN_SUBMITTING':
      return state.status === 'login' ? { ...state, submitting: true, error: null } : state

    case 'LOGIN_ERROR':
      return state.status === 'login' ? { ...state, submitting: false, error: action.error } : state

    case 'TV_INTRO_OPENED':
      return { status: 'tvIntro' }

    case 'TV_PICK_OPENED':
      return { status: 'tvPickDevice' }

    case 'TV_MANUAL_OPENED':
      return { status: 'tvManualMac', error: null }

    case 'MAC_INVALID':
      return state.status === 'tvManualMac' ? { ...state, error: 'invalid_mac' } : state

    case 'DEVICE_CHOSEN':
      return { status: 'tvChoosePackage', device: action.device }

    case 'CLOSED':
      return initialPortalState
  }
}
