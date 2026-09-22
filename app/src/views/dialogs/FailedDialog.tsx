import type { FailureReason } from '@/models/payment'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { FAILURE_COPY } from '../copy'

interface FailedDialogProps {
  reason: FailureReason
  onRetry: () => void
  onClose: () => void
}

export function FailedDialog({ reason, onRetry, onClose }: FailedDialogProps) {
  const copy = FAILURE_COPY[reason]
  return (
    <Modal title={copy.title} onClose={onClose}>
      <div className="flex flex-col gap-5" role="alert">
        <p className="text-muted">{copy.body}</p>
        <Button onClick={onRetry}>Try again</Button>
      </div>
    </Modal>
  )
}
