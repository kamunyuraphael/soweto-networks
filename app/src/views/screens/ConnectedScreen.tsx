import { site } from '@/config/site'
import { formatExpiry } from '@/lib/format'
import type { Session } from '@/models/session'
import { BrandHeader } from '../components/Header'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { ScreenShell } from '../components/ScreenShell'

export function ConnectedScreen({ session }: { session: Session }) {
  const expiry = formatExpiry(session.expiresAt)
  return (
    <ScreenShell header={<BrandHeader />}>
      <div className="flex flex-col items-center gap-3 pt-10 text-center" role="status" aria-live="polite">
        <span className="flex size-16 items-center justify-center rounded-full bg-ok-bg text-ok-ink">
          <Icon name="wifi" className="size-8" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">You are online</h1>
        <p className="text-muted">
          {session.packageName}
          {expiry && <> · ends {expiry}</>}
        </p>
      </div>
      <Button
        onClick={() => {
          window.location.href = session.redirectUrl ?? site.postLoginUrl
        }}
        className="mt-2"
      >
        Start browsing
      </Button>
    </ScreenShell>
  )
}
