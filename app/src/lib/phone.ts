/**
 * Accepts 0712 345 678, 0112345678, 712345678, +254712345678, 254712345678
 * and returns the Daraja/M-Pesa format (254XXXXXXXXX), or null if invalid.
 */
export function normalizeKenyanMsisdn(input: string): string | null {
  const cleaned = input.replace(/[\s\-()]/g, '').replace(/^\+/, '')
  const match = cleaned.match(/^(?:254|0)?([17]\d{8})$/)
  return match ? `254${match[1]}` : null
}

/** 254712345678 -> 0712 345 678 */
export function formatLocal(msisdn: string): string {
  const local = `0${msisdn.slice(3)}`
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`
}

/** 254712345678 -> 0712345678, as customer-care numbers are shown on the page. */
export function compactLocal(msisdn: string): string {
  return `0${msisdn.slice(3)}`
}

/** 254712345678 -> 0712 ••• 678 */
export function maskLocal(msisdn: string): string {
  const local = `0${msisdn.slice(3)}`
  return `${local.slice(0, 4)} ••• ${local.slice(7)}`
}

export function telHref(msisdn: string): string {
  return `tel:+${msisdn}`
}
