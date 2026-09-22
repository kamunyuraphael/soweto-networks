import { createHttpPortalApi } from './httpPortalApi'
import { createMockPortalApi } from './mockPortalApi'
import type { PortalApi } from './portalApi'

// Dev defaults to the mock; production builds default to the real backend.
// Override either way with VITE_USE_MOCK=true|false.
const flag = import.meta.env.VITE_USE_MOCK
const useMock = flag ? flag === 'true' : import.meta.env.DEV

export const portalApi: PortalApi = useMock ? createMockPortalApi() : createHttpPortalApi()
