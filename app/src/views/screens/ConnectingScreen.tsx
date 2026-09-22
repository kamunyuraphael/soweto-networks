import { BrandHeader } from '../components/Header'
import { ScreenShell } from '../components/ScreenShell'
import { Spinner } from '../components/Spinner'

export function ConnectingScreen() {
  return (
    <ScreenShell header={<BrandHeader />}>
      <div className="flex flex-col items-center gap-4 pt-16 text-center" role="status" aria-live="polite">
        <Spinner className="size-9 text-brand-ink" />
        <h1 className="text-2xl font-semibold tracking-tight">Connecting you…</h1>
      </div>
    </ScreenShell>
  )
}
