export function formatKsh(amount: number): string {
  return `Ksh ${amount.toLocaleString('en-KE')}`
}

/** 24 -> "0:24", 75 -> "1:15" */
export function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** "Tue 22 Sep, 2:14 pm" in the customer's locale, falling back to en-KE. */
export function formatExpiry(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
