/**
 * Captive-portal browsers often block or wipe localStorage, so every access
 * is wrapped: storage is a convenience, never something the flow depends on.
 */
const KEY = 'soweto.lastMsisdn'

export function loadSavedMsisdn(): string | null {
  try {
    return window.localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function saveMsisdn(msisdn: string): void {
  try {
    window.localStorage.setItem(KEY, msisdn)
  } catch {
    /* ignore */
  }
}
