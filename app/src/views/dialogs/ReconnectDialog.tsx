import { Modal } from '../components/Modal'
import { OptionRow } from '../components/OptionRow'

interface ReconnectDialogProps {
  onChoose: (method: 'voucher' | 'mpesa' | 'credentials') => void
  onClose: () => void
}

/** "How would you like to reconnect?" — matches the original three options. */
export function ReconnectDialog({ onChoose, onClose }: ReconnectDialogProps) {
  return (
    <Modal title="How would you like to reconnect?" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <OptionRow
          icon="ticket"
          title="Voucher"
          description="Use a prepaid code from a printed receipt or SMS."
          onClick={() => onChoose('voucher')}
        />
        <OptionRow
          icon="receipt"
          title="Reconnect with M-Pesa code"
          description="Reconnect using a transaction code from a recent payment."
          onClick={() => onChoose('mpesa')}
        />
        <OptionRow
          icon="key"
          title="Username & password"
          description="Sign in with your existing username and password."
          onClick={() => onChoose('credentials')}
        />
      </div>
    </Modal>
  )
}
