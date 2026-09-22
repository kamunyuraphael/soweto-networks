import type { FailureReason } from '@/models/payment'
import { BrandHeader } from '../components/Header'
import { Button } from '../components/Button'
import { ScreenShell } from '../components/ScreenShell'
import { FAILURE_COPY } from '../copy'

interface FailedScreenProps {
  reason: FailureReason
  onRetry: () => void
  onChooseAnother: () => void
}

export function FailedScreen({ reason, onRetry, onChooseAnother }: FailedScreenProps) {
  const copy = FAILURE_COPY[reason]
  return (
    <ScreenShell header={<BrandHeader />}>
      <div className="flex flex-col gap-2 pt-8" role="alert">
        <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted">{copy.body}</p>
      </div>
      <div className="flex flex-col gap-3">
        <Button onClick={onRetry}>Try again</Button>
        {copy.canChooseAnother && (
          <Button variant="secondary" onClick={onChooseAnother}>
            Choose another package
          </Button>
        )}
      </div>
    </ScreenShell>
  )
}
