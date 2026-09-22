import { compactLocal, telHref } from '@/lib/phone'

/** A customer-care number as on the original page: orange, bold, monospace, underlined, tap to call. */
export function PhoneLink({ phone }: { phone: string }) {
  return (
    <a
      href={telHref(phone)}
      className="font-mono font-bold text-brand-ink underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
    >
      {compactLocal(phone)}
    </a>
  )
}
