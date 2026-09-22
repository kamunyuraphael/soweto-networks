import { Button } from './Button'
import { Icon } from './Icon'

export function TrialBanner({ minutes, onStart }: { minutes: number; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-ok-line bg-ok-bg px-4 py-5 text-center">
      <p className="flex items-center gap-2 text-lg font-bold text-ok-ink">
        <Icon name="sparkles" className="size-5" />
        Try Our Internet Free
      </p>
      <p className="text-sm text-muted">Get {minutes}m of free internet access</p>
      <Button variant="action" onClick={onStart} className="mt-1">
        Start Free Trial
      </Button>
    </div>
  )
}
