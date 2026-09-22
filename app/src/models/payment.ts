/** Failure outcomes reported by the payment provider. */
export type PaymentFailure = 'cancelled' | 'wrong_pin' | 'insufficient_funds' | 'failed'

export type PaymentStatus = 'pending' | 'success' | PaymentFailure

/** Everything that can send the customer to the failure screen. */
export type FailureReason =
  | PaymentFailure
  | 'timeout' // no answer to the M-Pesa prompt in time
  | 'prompt_failed' // couldn't send the M-Pesa prompt
  | 'network' // couldn't reach the portal backend
  | 'activation_failed' // paid, but the hotspot login didn't complete
