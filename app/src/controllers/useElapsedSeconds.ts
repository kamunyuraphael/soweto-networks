import { useEffect, useState } from 'react'

/** Seconds since `startedAt` (ms epoch), ticking once a second. */
export function useElapsedSeconds(startedAt: number): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return Math.max(0, Math.floor((now - startedAt) / 1000))
}
