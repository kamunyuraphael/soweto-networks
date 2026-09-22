import { Icon, type IconName } from './Icon'

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  icon?: IconName
  type?: 'text' | 'tel' | 'password'
  inputMode?: 'text' | 'tel'
  autoComplete?: string
  autoCapitalize?: string
  placeholder?: string
  hint?: string
  error?: string | null
  disabled?: boolean
  autoFocus?: boolean
}

export function TextField({
  id,
  label,
  value,
  onChange,
  icon,
  type = 'text',
  inputMode,
  autoComplete,
  autoCapitalize,
  placeholder,
  hint,
  error,
  disabled,
  autoFocus,
}: TextFieldProps) {
  const noteId = error || hint ? `${id}-note` : undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted"
          />
        )}
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={noteId}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 w-full rounded-xl border bg-surface pr-3.5 text-base outline-none placeholder:text-muted/70 focus:ring-4 disabled:opacity-70 ${
            icon ? 'pl-11' : 'pl-3.5'
          } ${
            error
              ? 'border-bad-ink focus:ring-bad-ink/20'
              : 'border-line-strong focus:border-brand focus:ring-brand/20'
          }`}
        />
      </div>
      {error ? (
        <p id={noteId} role="alert" className="mt-1.5 text-sm text-bad-ink">
          {error}
        </p>
      ) : hint ? (
        <p id={noteId} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
