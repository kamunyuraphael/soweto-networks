import { site } from '@/config/site'
import type { Package } from '@/models/package'
import { Button } from '../components/Button'
import { InstructionsCard } from '../components/InstructionsCard'
import { PackageGrid } from '../components/PackageGrid'
import { PageHeader } from '../components/PageHeader'
import { PhoneLink } from '../components/PhoneLink'
import { StatusBanner } from '../components/StatusBanner'
import { TrialBanner } from '../components/TrialBanner'

interface HomePageProps {
  packages: Package[]
  notice: string | null
  onSelectPackage: (pkg: Package) => void
  onStartTrial: () => void
  onAlreadySubscribed: () => void
  onOpenTv: () => void
}

export function HomePage({
  packages,
  notice,
  onSelectPackage,
  onStartTrial,
  onAlreadySubscribed,
  onOpenTv,
}: HomePageProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pb-10">
      <PageHeader />

      {notice && <StatusBanner message={notice} />}

      <InstructionsCard />

      <div className="flex flex-col items-center gap-1 py-1 text-center">
        <p className="text-sm text-muted">
          Need help? <PhoneLink phone={site.support.phones[0]} />
        </p>
        <p className="font-bold">Already subscribed?</p>
        <Button variant="action" onClick={onAlreadySubscribed}>
          Login / Activate Package
        </Button>
      </div>

      <TrialBanner minutes={site.trial.minutes} onStart={onStartTrial} />

      <PackageGrid packages={packages} onSelect={onSelectPackage} />

      <button
        type="button"
        onClick={onOpenTv}
        className="mt-1 flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-line bg-canvas px-4 py-3 text-left transition-colors active:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
      >
        <span className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-chip text-brand-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
              <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9z" />
              <path d="M16 3l-4 4l-4 -4" />
            </svg>
          </span>
          <span className="font-semibold">Set up a TV or streaming device</span>
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0 text-muted" aria-hidden="true">
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </button>
    </div>
  )
}
