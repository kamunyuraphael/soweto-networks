import { PhoneLink } from '../components/PhoneLink'
import { Modal } from '../components/Modal'
import { site } from '@/config/site'

/** Placeholder: kept as an entry point, not built out yet. */
export function TvSetupDialog({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Set up a TV or streaming device" onClose={onClose}>
      <p className="text-muted">
        This guide is coming soon. For now, call <PhoneLink phone={site.support.phones[0]} /> and we will help
        you connect it.
      </p>
    </Modal>
  )
}
