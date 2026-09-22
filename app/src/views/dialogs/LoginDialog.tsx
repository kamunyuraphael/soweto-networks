import { useState, type FormEvent } from 'react'
import type { LoginError, LoginMethod } from '@/models/login'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { TextField } from '../components/TextField'

const TITLES: Record<LoginMethod, string> = {
  voucher: 'Enter your voucher code',
  mpesa: 'Enter your M-Pesa code',
  credentials: 'Username & password',
}

const ERROR_COPY: Record<LoginError, string> = {
  invalid_input: 'Enter a code to continue.',
  not_found: "We couldn't find that code. Check it and try again.",
  used_or_expired: 'That code has already been used, or the package has ended.',
  invalid_credentials: 'Wrong username or password.',
  network: "Couldn't reach the network. Try again.",
}

interface LoginDialogProps {
  method: LoginMethod
  error: LoginError | null
  submitting: boolean
  onSubmit: (
    input: { method: 'voucher'; code: string } | { method: 'mpesa'; code: string } | { method: 'credentials'; username: string; password: string },
  ) => void
  onBack: () => void
  onClose: () => void
}

export function LoginDialog({ method, error, submitting, onSubmit, onBack, onClose }: LoginDialogProps) {
  const [code, setCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // Hide the server error as soon as the customer edits a field.
  const [edited, setEdited] = useState(false)
  const shownError = edited ? null : error

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setEdited(false)
    if (method === 'credentials') {
      onSubmit({ method, username, password })
    } else {
      onSubmit({ method, code })
    }
  }

  return (
    <Modal title={TITLES[method]} onClose={onClose} onBack={onBack} dismissOnBackdrop={!submitting}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {method === 'credentials' ? (
          <>
            <TextField
              id="login-username"
              label="Username"
              value={username}
              onChange={(v) => {
                setUsername(v)
                setEdited(true)
              }}
              autoComplete="username"
              disabled={submitting}
              autoFocus
            />
            <TextField
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(v) => {
                setPassword(v)
                setEdited(true)
              }}
              autoComplete="current-password"
              disabled={submitting}
            />
          </>
        ) : (
          <TextField
            id="login-code"
            label={method === 'voucher' ? 'Voucher code' : 'M-Pesa transaction code'}
            value={code}
            onChange={(v) => {
              setCode(v)
              setEdited(true)
            }}
            placeholder={method === 'voucher' ? 'e.g. ABC123XYZ' : 'e.g. QGH7K2LM9P'}
            autoCapitalize="characters"
            disabled={submitting}
            autoFocus
          />
        )}
        {shownError && (
          <p role="alert" className="-mt-2 text-sm text-bad-ink">
            {ERROR_COPY[shownError]}
          </p>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner className="size-4" />
              Checking…
            </>
          ) : (
            'Reconnect'
          )}
        </Button>
      </form>
    </Modal>
  )
}
