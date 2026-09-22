/** Deployment-specific settings. Change these without touching any logic. */
export const site = {
  brandName: 'Soweto Network',
  support: {
    /**
     * Customer-care numbers in international format. The first is the main
     * "Need help?" number; every number also gets its own step in the
     * "How to purchase" list, as on the original page.
     */
    phones: ['254742250184'],
  },
  trial: {
    minutes: 3,
  },
  payment: {
    pollIntervalMs: 2500,
    /** How long to wait for the customer to enter their M-Pesa PIN. */
    timeoutMs: 90_000,
    /** When the "Resend" link appears. */
    resendAfterSeconds: 20,
  },
  /** Where "Start browsing" goes if the backend doesn't return a redirect URL. */
  postLoginUrl: 'https://www.google.com',
} as const
