import { useState, type FormEvent } from 'react'
import { BackHeader } from '../components/Header'
import { Button } from '../components/Button'
import { PhoneField } from '../components/PhoneField'
import { ScreenShell } from '../components/ScreenShell'
import { Spinner } from '../components/Spinner'

interface LoginScreenProps {
  initialPhone: string
  error: string | null
  submitting: boolean
  onSubmit: (rawPhone: string) => void
  onBack: () => void
}

export function LoginScreen({ initialPhone, error, submitting, onSubmit, onBack }: LoginScreenProps) {
  const [phone, setPhone] = useState(initialPhone)
  const [edited, setEdited] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setEdited(false)
    onSubmit(phone)
  }

  return (
    <ScreenShell header={<BackHeader onBack={onBack} />}>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
        <p className="text-muted">Already paid? Enter the M-Pesa number you paid with.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PhoneField
          id="login-number"
          label="M-Pesa number"
          value={phone}
          onChange={(v) => {
            setPhone(v)
            setEdited(true)
          }}
          error={edited ? null : error}
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner className="size-4" />
              Checking…
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </form>
    </ScreenShell>
  )
}
