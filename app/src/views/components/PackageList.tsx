import { formatKsh } from '@/lib/format'
import type { Package, PackageBadge, PackageGroup } from '@/models/package'

const BADGES: Record<PackageBadge, { label: string; className: string }> = {
  popular: { label: 'Most popular', className: 'bg-chip text-chip-ink' },
  'best-value': { label: 'Best value', className: 'bg-ok-bg text-ok-ink' },
}

function PackageRow({ pkg, onSelect }: { pkg: Package; onSelect: (pkg: Package) => void }) {
  const badge = pkg.badge ? BADGES[pkg.badge] : null
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(pkg)}
        className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors active:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-ink"
      >
        <span className="min-w-0">
          <span className="block text-base font-medium">{pkg.name}</span>
          {pkg.detail && <span className="block text-sm text-muted">{pkg.detail}</span>}
          {badge && (
            <span className={`mt-1 inline-block rounded-md px-1.5 py-0.5 text-xs font-medium ${badge.className}`}>
              {badge.label}
            </span>
          )}
        </span>
        <span className="shrink-0 text-base font-semibold tabular-nums">{formatKsh(pkg.priceKsh)}</span>
      </button>
    </li>
  )
}

export function PackageList({
  groups,
  onSelect,
}: {
  groups: PackageGroup[]
  onSelect: (pkg: Package) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`} className="px-1 pb-1.5 text-sm font-medium text-muted">
            {group.label}
          </h2>
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
            {group.packages.map((pkg) => (
              <PackageRow key={pkg.id} pkg={pkg} onSelect={onSelect} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
