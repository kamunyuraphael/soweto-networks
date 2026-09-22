import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { TextField } from '../components/TextField'

interface TvManualMacDialogProps {
  invalid: boolean
  onSubmit: (rawMac: string) => void
  onBack: () => void
  onClose: () => void
}

export function TvManualMacDialog({ invalid, onSubmit, onBack, onClose }: TvManualMacDialogProps) {
  const [value, setValue] = useState('')
  const [edited, setEdited] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setEdited(false)
    onSubmit(value)
  }

  return (
    <Modal title="Enter the MAC address" onClose={onClose} onBack={onBack}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          id="device-mac"
          label="MAC address"
          value={value}
          onChange={(v) => {
            setValue(v)
            setEdited(true)
          }}
          placeholder="AA:BB:CC:DD:EE:FF"
          autoCapitalize="characters"
          hint="Usually printed in the device's Wi-Fi or network settings."
          error={
            !edited && invalid
              ? "That doesn't look like a MAC address. It's usually 12 letters and numbers."
              : null
          }
          autoFocus
        />
        <Button type="submit">Continue</Button>
      </form>
    </Modal>
  )
}
