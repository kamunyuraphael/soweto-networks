import { site } from '@/config/site'
import { formatExpiry } from '@/lib/format'
import type { Session } from '@/models/session'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'

export function ConnectedDialog({ session, onClose }: { session: Session; onClose: () => void }) {
  const expiry = formatExpiry(session.expiresAt)
  return (
    <Modal title="You are online" onClose={onClose}>
      <div className="flex flex-col items-center gap-4 py-2 text-center" role="status" aria-live="polite">
        <span className="flex size-16 items-center justify-center rounded-full bg-ok-bg text-ok-ink">
          <Icon name="wifi" className="size-8" />
        </span>
        <p className="text-muted">
          {session.packageName}
          {expiry && <> · ends {expiry}</>}
        </p>
        <Button
          onClick={() => {
            window.location.href = session.redirectUrl ?? site.postLoginUrl
          }}
          className="mt-1"
        >
          Start browsing
        </Button>
      </div>
    </Modal>
  )
}
