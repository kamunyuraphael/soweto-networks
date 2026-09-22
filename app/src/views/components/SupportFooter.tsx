import { site } from '@/config/site'
import { formatLocal, telHref } from '@/lib/phone'
import { Icon } from './Icon'

export function SupportFooter() {
  return (
    <footer className="mt-auto border-t border-line px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-center">
      <a
        href={telHref(site.support.phone)}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
      >
        <Icon name="phone" className="size-4" />
        <span>
          Need help? <span className="font-medium text-brand-ink">{formatLocal(site.support.phone)}</span>
        </span>
      </a>
    </footer>
  )
}
