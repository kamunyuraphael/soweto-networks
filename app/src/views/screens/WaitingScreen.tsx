import { site } from '@/config/site'
import { useElapsedSeconds } from '@/controllers/useElapsedSeconds'
import { formatElapsed, formatKsh } from '@/lib/format'
import { maskLocal } from '@/lib/phone'
import type { Package } from '@/models/package'
import { BrandHeader } from '../components/Header'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { ScreenShell } from '../components/ScreenShell'
import { StepList } from '../components/StepList'

interface WaitingScreenProps {
  pkg: Package
  msisdn: string
  step: 'pin' | 'connecting'
  startedAt: number
  onResend: () => void
  onCancel: () => void
}

export function WaitingScreen({ pkg, msisdn, step, startedAt, onResend, onCancel }: WaitingScreenProps) {
  const elapsed = useElapsedSeconds(startedAt)
  const paid = step === 'connecting'
  const canResend = !paid && elapsed >= site.payment.resendAfterSeconds

  return (
    <ScreenShell header={<BrandHeader />}>
      <div className="flex flex-col items-center gap-3 pt-6 text-center" role="status" aria-live="polite">
        <span className="flex size-14 items-center justify-center rounded-full bg-chip text-chip-ink">
          <Icon name="mobile" className="size-7" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          {paid ? 'Payment received' : 'Check your phone'}
        </h1>
        <p className="text-muted">
          {paid
            ? 'Connecting you now.'
            : `Enter your M-Pesa PIN to pay ${formatKsh(pkg.priceKsh)}. You will be connected automatically.`}
        </p>
      </div>

      <StepList
        steps={[
          { label: `Prompt sent to ${maskLocal(msisdn)}`, state: 'done' },
          { label: 'Enter your PIN', state: paid ? 'done' : 'current' },
          { label: 'Get connected', state: paid ? 'current' : 'todo' },
        ]}
      />

      {!paid && (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm text-muted tabular-nums">Waiting… {formatElapsed(elapsed)}</p>
          {canResend && (
            <p className="text-sm text-muted">
              Did not get a prompt?{' '}
              <Button variant="link" onClick={onResend} className="inline-flex px-1 align-baseline">
                Resend
              </Button>
            </p>
          )}
          <Button variant="link" onClick={onCancel} className="text-muted">
            Cancel
          </Button>
        </div>
      )}
    </ScreenShell>
  )
}
