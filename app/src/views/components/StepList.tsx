
export type StepState = 'done' | 'current' | 'todo'

export function StepList({ steps }: { steps: { label: string; state: StepState }[] }) {
  return (
    <ol className="flex flex-col gap-1">
      {steps.map((step) => (
        <li
          key={step.label}
          aria-current={step.state === 'current' ? 'step' : undefined}
          className={`flex items-center gap-3 py-1.5 text-base ${
            step.state === 'current' ? 'font-semibold' : step.state === 'todo' ? 'text-muted' : ''
          }`}
        >
          {step.state === 'done' ? (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ok-fill text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
                <path d="M5 12l5 5l10 -10" />
              </svg>
            </span>
          ) : (
            <span
              className={`size-6 shrink-0 rounded-full border-2 ${
                step.state === 'current' ? 'border-brand' : 'border-line-strong'
              }`}
            />
          )}
          {step.label}
        </li>
      ))}
    </ol>
  )
}
