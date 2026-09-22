import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'action' | 'secondary' | 'link'

const BASE =
  'inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink disabled:opacity-70'

const VARIANTS: Record<ButtonVariant, string> = {
  /** Full-width orange button (Pay now, Connect). */
  primary: 'h-12 w-full rounded-xl bg-brand px-4 text-base font-bold text-on-brand shadow-sm active:brightness-95',
  /** Content-width orange button (Login / Activate Package, Start Free Trial). */
  action: 'h-12 rounded-xl bg-brand px-6 text-base font-bold text-on-brand shadow-sm active:brightness-95',
  secondary:
    'h-12 w-full rounded-xl border border-line-strong bg-canvas px-4 text-base font-semibold text-ink active:bg-surface',
  link: 'min-h-11 px-2 text-sm font-semibold text-brand-ink underline underline-offset-2',
}

/** Same look for <a> elements, e.g. a "Call customer care" link. */
export function buttonClass(variant: ButtonVariant = 'primary', extra = ''): string {
  return `${BASE} ${VARIANTS[variant]} ${extra}`
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />
}
