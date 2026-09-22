import { site } from '@/config/site'
import { useElapsedSeconds } from '@/controllers/useElapsedSeconds'
import { formatElapsed, formatKsh } from '@/lib/format'
import { maskLocal } from '@/lib/phone'
import type { Package } from '@/models/package'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { StepList } from '../components/StepList'

interface WaitingDialogProps {
  pkg: Package
  msisdn: string
  step: 'pin' | 'connecting'
  startedAt: number
  onResend: () => void
  onClose: () => void
}

export function WaitingDialog({ pkg, msisdn, step, startedAt, onResend, onClose }: WaitingDialogProps) {
  const elapsed = useElapsedSeconds(startedAt)
  const paid = step === 'connecting'
  const canResend = !paid && elapsed >= site.payment.resendAfterSeconds

  return (
    <Modal title={paid ? 'Payment received' : 'Check your phone'} onClose={onClose} dismissOnBackdrop={false}>
      <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
        <span className="flex size-14 items-center justify-center rounded-full bg-chip text-brand-ink">
          <Icon name="phone" className="size-7" />
        </span>
        <p className="text-center text-muted">
          {paid
            ? 'Connecting you now.'
            : `Enter your Mobile Money PIN to pay ${formatKsh(pkg.priceKsh)}. You will be connected automatically.`}
        </p>

        <div className="w-full">
          <StepList
            steps={[
              { label: `Prompt sent to ${maskLocal(msisdn)}`, state: 'done' },
              { label: 'Enter your PIN', state: paid ? 'done' : 'current' },
              { label: 'Get connected', state: paid ? 'current' : 'todo' },
            ]}
          />
        </div>

        {!paid && (
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm text-muted tabular-nums">Waiting… {formatElapsed(elapsed)}</p>
            {canResend && (
              <Button variant="link" onClick={onResend} className="px-1">
                Resend prompt
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
