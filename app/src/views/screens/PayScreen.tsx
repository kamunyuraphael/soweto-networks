import { useState, type FormEvent } from 'react'
import { formatKsh } from '@/lib/format'
import type { Package } from '@/models/package'
import { BackHeader } from '../components/Header'
import { Button } from '../components/Button'
import { PhoneField } from '../components/PhoneField'
import { ScreenShell } from '../components/ScreenShell'
import { Spinner } from '../components/Spinner'

interface PayScreenProps {
  pkg: Package
  initialPhone: string
  error: string | null
  submitting: boolean
  onSubmit: (rawPhone: string) => void
  onBack: () => void
}

export function PayScreen({ pkg, initialPhone, error, submitting, onSubmit, onBack }: PayScreenProps) {
  const [phone, setPhone] = useState(initialPhone)
  // Hide the validation error as soon as the customer edits the number.
  const [edited, setEdited] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setEdited(false)
    onSubmit(phone)
  }

  return (
    <ScreenShell header={<BackHeader onBack={onBack} />}>
      <h1 className="text-2xl font-semibold tracking-tight">Pay for {pkg.name}</h1>

      <div className="rounded-xl bg-surface px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-medium">
            {pkg.name} · {pkg.devices} {pkg.devices === 1 ? 'device' : 'devices'}
          </p>
          <p className="font-semibold tabular-nums">{formatKsh(pkg.priceKsh)}</p>
        </div>
        <p className="mt-0.5 text-sm text-muted">Starts when payment is confirmed.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PhoneField
          id="mpesa-number"
          label="M-Pesa number"
          value={phone}
          onChange={(v) => {
            setPhone(v)
            setEdited(true)
          }}
          error={edited ? null : error}
          hint="We will send a payment prompt to this number."
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner className="size-4" />
              Sending prompt…
            </>
          ) : (
            `Pay ${formatKsh(pkg.priceKsh)}`
          )}
        </Button>
        <p className="text-center text-sm text-muted">Then enter your M-Pesa PIN on the prompt.</p>
      </form>
    </ScreenShell>
  )
}
