export interface Package {
  id: string
  /** Exactly as shown on the card and in the payment dialog. */
  name: string
  priceKsh: number
  /** Shown after the price as "for {duration}". Some packages have none. */
  duration?: string
  /** Used only by the mock API to work out when a session ends. */
  durationMinutes: number
}
