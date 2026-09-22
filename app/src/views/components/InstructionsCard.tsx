import { site } from '@/config/site'
import { PhoneLink } from './PhoneLink'

const STEPS = [
  'Tap the package you want to purchase',
  'Enter your Mobile Money phone number',
  'Click subscribe',
  'Enter your Mobile Money PIN in the prompt',
  'Wait a few seconds to be connected',
]

/** "How to purchase" card, matching the original: numbered steps, then one "contact customer care" step per support number. */
export function InstructionsCard() {
  return (
    <section className="rounded-2xl bg-surface p-4">
      <h2 className="mb-3 flex items-center justify-center gap-2 text-center text-base font-bold">
        <span aria-hidden="true" className="text-brand-ink">
          →]
        </span>
        How to purchase:
      </h2>
      <div className="rounded-xl bg-canvas p-4">
        <ol className="flex list-none flex-col gap-2.5 text-sm">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-2.5">
              <span className="w-4 shrink-0 font-bold text-brand-ink">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
          {site.support.phones.map((phone, i) => (
            <li key={phone} className="flex gap-2.5">
              <span className="w-4 shrink-0 font-bold text-brand-ink">{STEPS.length + i + 1}.</span>
              <span>
                If not connected, contact customer care <PhoneLink phone={phone} />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
