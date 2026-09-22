import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Icon } from './Icon'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

interface ModalProps {
  title: string
  onClose: () => void
  /** Shows a back arrow before the title. */
  onBack?: () => void
  /** Set to false while something is in progress so a stray tap can't dismiss it. */
  dismissOnBackdrop?: boolean
  children: ReactNode
}

/** Dialog over a dimmed page: Esc closes, Tab stays inside, focus returns to where it was. */
export function Modal({ title, onClose, onBack, dismissOnBackdrop = true, children }: ModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  // Read during the first render, before any autoFocus'd field steals focus.
  const openerRef = useRef<Element | null>(document.activeElement)

  useEffect(() => {
    const opener = openerRef.current as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    if (panel && !panel.contains(document.activeElement)) panel.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const panel = panelRef.current
    const nodes = panel?.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (!panel || !nodes || nodes.length === 0) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || active === panel)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => {
        if (dismissOnBackdrop && e.target === e.currentTarget) onClose()
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-pop-in max-h-[calc(100dvh-2rem)] w-full max-w-[26rem] overflow-y-auto rounded-[20px] bg-canvas p-6 shadow-2xl outline-none"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back"
                className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-full text-muted active:bg-surface focus-visible:outline-2 focus-visible:outline-brand-ink"
              >
                <Icon name="chevronLeft" />
              </button>
            )}
            <h2 id={titleId} className="text-xl font-bold leading-tight">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full text-muted active:bg-surface focus-visible:outline-2 focus-visible:outline-brand-ink"
          >
            <Icon name="x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
