import { Modal } from '../components/Modal'
import { OptionRow } from '../components/OptionRow'

interface TvIntroDialogProps {
  onPickNearby: () => void
  onEnterMac: () => void
  onClose: () => void
}

/** "Add a TV or device" — matches the shared design: intro text, then two ways to identify it. */
export function TvIntroDialog({ onPickNearby, onEnterMac, onClose }: TvIntroDialogProps) {
  return (
    <Modal title="Add a TV or device" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-muted">
          First connect the device to this Wi-Fi. Then choose it below — it pays for its own plan and
          stays online by itself.
        </p>
        <div className="flex flex-col gap-3">
          <OptionRow
            icon="wifi"
            title="Pick a nearby device"
            description="Choose from devices connected to this Wi-Fi."
            onClick={onPickNearby}
          />
          <OptionRow
            icon="edit"
            title="Enter the MAC address"
            description="Type the device's MAC, printed in its network settings."
            onClick={onEnterMac}
          />
        </div>
      </div>
    </Modal>
  )
}
