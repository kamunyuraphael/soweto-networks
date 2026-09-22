import { useState, type FormEvent } from 'react'
import type { DeviceRef } from '@/models/device'
import type { Package } from '@/models/package'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { TextField } from '../components/TextField'

interface PaymentDialogProps {
  pkg: Package
  device?: DeviceRef
  initialPhone: string
  invalid: boolean
  submitting: boolean
  onSubmit: (rawPhone: string) => void
  onClose: () => void
}

/** "Complete payment" — matches the original: package summary tile, phone field, Pay now. */
export function PaymentDialog({ pkg, device, initialPhone, invalid, submitting, onSubmit, onClose }: PaymentDialogProps) {
  const [phone, setPhone] = useState(initialPhone)
  const [edited, setEdited] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setEdited(false)
    onSubmit(phone)
  }

  return (
    <Modal title="Complete payment" onClose={onClose} dismissOnBackdrop={!submitting}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-tile-blue text-brand-ink">
            <Icon name="wifi" className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Selected package</p>
            <p className="truncate font-bold">{pkg.name}</p>
            {pkg.duration && <p className="text-sm text-muted">{pkg.duration}</p>}
            {device && <p className="text-sm text-muted">for {device.label}</p>}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Ksh</p>
            <p className="font-mono text-2xl font-extrabold text-brand-ink">{pkg.priceKsh}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            id="mpesa-number"
            label="Phone number"
            icon="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="07XX XXX XXX"
            value={phone}
            onChange={(v) => {
              setPhone(v)
              setEdited(true)
            }}
            error={!edited && invalid ? 'Enter your Mobile Money number, like 0712 345 678.' : null}
            disabled={submitting}
            autoFocus
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner className="size-4" />
                Sending prompt…
              </>
            ) : (
              'Pay now'
            )}
          </Button>
          <p className="rounded-xl bg-surface px-3.5 py-3 text-center text-sm text-muted">
            You&apos;ll get a payment prompt on your phone. Enter your Mobile Money PIN to authorise and connect.
          </p>
        </form>
      </div>
    </Modal>
  )
}
