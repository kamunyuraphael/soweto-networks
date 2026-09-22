export interface Session {
  packageName: string
  /** ISO 8601 timestamp when the package ends. */
  expiresAt: string
  /** Optional URL the backend wants the customer sent to after login. */
  redirectUrl?: string
}
