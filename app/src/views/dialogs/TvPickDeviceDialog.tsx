import type { NetworkDevice } from '@/models/device'
import { maskMac } from '@/lib/mac'
import { Modal } from '../components/Modal'
import { OptionRow } from '../components/OptionRow'
import { Spinner } from '../components/Spinner'

interface TvPickDeviceDialogProps {
  devices: NetworkDevice[] | null
  loading: boolean
  onChoose: (device: NetworkDevice) => void
  onBack: () => void
  onClose: () => void
}

export function TvPickDeviceDialog({ devices, loading, onChoose, onBack, onClose }: TvPickDeviceDialogProps) {
  const showLoading = loading || devices === null

  return (
    <Modal title="Pick a nearby device" onClose={onClose} onBack={onBack}>
      {showLoading ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center text-muted" role="status">
          <Spinner className="size-6 text-brand-ink" />
          Looking for devices on this Wi-Fi…
        </div>
      ) : devices.length === 0 ? (
        <p className="py-2 text-muted">
          No devices found yet. Make sure it is connected to this Wi-Fi, then try again.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {devices.map((device) => (
            <li key={device.id}>
              <OptionRow
                icon="tv"
                title={device.label}
                description={maskMac(device.mac)}
                onClick={() => onChoose(device)}
              />
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
