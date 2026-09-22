import type { ChangeEvent } from 'react'

interface PhoneFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string | null
  hint?: string
  disabled?: boolean
}

export function PhoneField({ id, label, value, onChange, error, hint, disabled }: PhoneFieldProps) {
  const describedBy = error || hint ? `${id}-note` : undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-muted">
        {label}
      </label>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="0712 345 678"
        value={value}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className={`h-12 w-full rounded-xl border bg-canvas px-3.5 text-lg tabular-nums outline-none placeholder:text-muted/60 focus:ring-2 focus:ring-brand/40 disabled:opacity-70 ${
          error ? 'border-bad-ink' : 'border-line-strong focus:border-brand-ink'
        }`}
      />
      {error ? (
        <p id={`${id}-note`} role="alert" className="mt-1.5 text-sm text-bad-ink">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-note`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
