import { usePortalController } from '@/controllers/usePortalController'
import { portalApi } from '@/services'
import { PortalView } from '@/views/PortalView'

export default function App() {
  const controller = usePortalController(portalApi)
  return <PortalView controller={controller} />
}
