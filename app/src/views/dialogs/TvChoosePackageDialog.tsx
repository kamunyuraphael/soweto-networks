import { formatKsh } from '@/lib/format'
import type { DeviceRef } from '@/models/device'
import type { Package } from '@/models/package'
import { Modal } from '../components/Modal'

interface TvChoosePackageDialogProps {
  device: DeviceRef
  packages: Package[]
  onSelect: (pkg: Package) => void
  onBack: () => void
  onClose: () => void
}

/** Package list scoped to one device, reusing the catalog shown on the home page. */
export function TvChoosePackageDialog({ device, packages, onSelect, onBack, onClose }: TvChoosePackageDialogProps) {
  return (
    <Modal title={`Choose a plan for ${device.label}`} onClose={onClose} onBack={onBack}>
      <ul className="flex flex-col gap-2">
        {packages.map((pkg) => (
          <li key={pkg.id}>
            <button
              type="button"
              onClick={() => onSelect(pkg)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-3 text-left transition-colors active:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-snug">{pkg.name}</span>
                {pkg.duration && <span className="block text-xs text-muted">for {pkg.duration}</span>}
              </span>
              <span className="shrink-0 whitespace-nowrap font-mono font-extrabold text-brand-ink">
                {formatKsh(pkg.priceKsh)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
