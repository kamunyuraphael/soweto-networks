import { formatKsh } from '@/lib/format'
import type { Package } from '@/models/package'

function PackageTile({ pkg, onSelect }: { pkg: Package; onSelect: (pkg: Package) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pkg)}
      className="flex min-h-28 flex-col items-start gap-1.5 rounded-xl border border-line bg-canvas p-3.5 text-left transition-colors active:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
    >
      <span className="text-sm font-bold leading-snug">{pkg.name}</span>
      <span className="mt-auto flex flex-col">
        <span className="whitespace-nowrap font-mono text-lg font-extrabold text-brand-ink">
          {formatKsh(pkg.priceKsh)}
        </span>
        {pkg.duration && <span className="text-xs text-muted">for {pkg.duration}</span>}
      </span>
    </button>
  )
}

/** Grid of package tiles, three across, as on the original "UNLIMITED PACKAGES" section. */
export function PackageGrid({ packages, onSelect }: { packages: Package[]; onSelect: (pkg: Package) => void }) {
  return (
    <section>
      <h2 className="mb-2.5 text-center text-xs font-bold uppercase tracking-widest text-muted">
        Unlimited packages
      </h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {packages.map((pkg) => (
          <PackageTile key={pkg.id} pkg={pkg} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
