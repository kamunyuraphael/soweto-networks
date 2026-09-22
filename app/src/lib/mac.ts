/**
 * Accepts AA:BB:CC:DD:EE:FF, AA-BB-CC-DD-EE-FF, or no separators at all;
 * returns the canonical AA:BB:CC:DD:EE:FF form, or null if invalid.
 */
export function normalizeMac(input: string): string | null {
  const hex = input.replace(/[^0-9a-fA-F]/g, '').toUpperCase()
  if (hex.length !== 12) return null
  return hex.match(/.{2}/g)!.join(':')
}

/** AA:BB:CC:DD:EE:FF -> AA:BB:••:••:EE:FF */
export function maskMac(mac: string): string {
  const parts = mac.split(':')
  return [...parts.slice(0, 2), '••', '••', ...parts.slice(4)].join(':')
}
