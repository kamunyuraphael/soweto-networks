import type { DeviceRef, NetworkDevice } from '@/models/device'
import type { LoginInput } from '@/models/login'
import type { PaymentStatus } from '@/models/payment'
import type { Session } from '@/models/session'
import { ApiError, type PortalApi, type PortalStatus } from './portalApi'

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    let code: string | undefined
    try {
      code = (await res.json()).code
    } catch {
      /* body wasn't JSON */
    }
    throw new ApiError(`Request failed (${res.status})`, code)
  }
  return (await res.json()) as T
}

const post = (body?: unknown): RequestInit => ({
  method: 'POST',
  body: body === undefined ? undefined : JSON.stringify(body),
})

export function createHttpPortalApi(): PortalApi {
  return {
    getStatus: () => request<PortalStatus>('/api/portal/status'),
    startTrial: () => request<Session>('/api/portal/trial', post()),
    requestPayment: (input: { packageId: string; phone: string; device?: DeviceRef }) =>
      request<{ paymentId: string }>('/api/portal/payments', post(input)),
    getPaymentStatus: async (paymentId) => {
      const res = await request<{ status: PaymentStatus }>(
        `/api/portal/payments/${encodeURIComponent(paymentId)}`,
      )
      return res.status
    },
    activatePackage: (paymentId) =>
      request<Session>(`/api/portal/payments/${encodeURIComponent(paymentId)}/activate`, post()),
    login: (input: LoginInput) => request<Session>('/api/portal/login', post(input)),
    listNearbyDevices: () => request<NetworkDevice[]>('/api/portal/devices/nearby'),
  }
}
