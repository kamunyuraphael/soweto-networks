import { Icon, type IconName } from './Icon'

interface OptionRowProps {
  icon: IconName
  title: string
  description: string
  onClick: () => void
}

/** Tappable row with an orange icon tile, title, description and a chevron. */
export function OptionRow({ icon, title, description, onClick }: OptionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-canvas p-3 text-left transition-colors active:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-chip text-brand-ink">
        <Icon name={icon} className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-muted">{description}</span>
      </span>
      <Icon name="chevronRight" className="size-5 shrink-0 text-muted" />
    </button>
  )
}
