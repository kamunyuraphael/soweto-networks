import { useEffect, useState } from 'react'
import type { PortalApi } from '@/services/portalApi'

/** Loads the optional service notice (e.g. "M-Pesa is slow right now"). */
export function usePortalNotice(api: PortalApi): string | null {
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    api
      .getStatus()
      .then((status) => {
        if (active) setNotice(status.notice)
      })
      .catch(() => {
        /* a missing notice must never block the customer */
      })
    return () => {
      active = false
    }
  }, [api])

  return notice
}
