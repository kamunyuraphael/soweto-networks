import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'

export function ConnectingDialog({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Connecting" onClose={onClose} dismissOnBackdrop={false}>
      <div className="flex flex-col items-center gap-4 py-4 text-center" role="status" aria-live="polite">
        <Spinner className="size-9 text-brand-ink" />
        <p className="text-muted">Connecting you…</p>
      </div>
    </Modal>
  )
}
