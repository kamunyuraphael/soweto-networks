import type { FailureReason } from '@/models/payment'

/** Every failure says what happened and what to do next. No system jargon. */
export const FAILURE_COPY: Record<FailureReason, { title: string; body: string }> = {
  cancelled: {
    title: 'Payment cancelled',
    body: 'You cancelled the Mobile Money prompt. Try again when you are ready.',
  },
  wrong_pin: {
    title: 'Wrong PIN',
    body: 'The Mobile Money PIN you entered was not correct. Try again and check it carefully.',
  },
  insufficient_funds: {
    title: 'Not enough Mobile Money balance',
    body: 'Top up your Mobile Money, or choose a cheaper package.',
  },
  failed: {
    title: 'Payment did not go through',
    body: 'Try again in a moment.',
  },
  timeout: {
    title: 'We did not get your payment',
    body: 'If you already entered your PIN, wait a minute, then use "Already subscribed?" on the home screen. Otherwise, try again.',
  },
  prompt_failed: {
    title: 'Could not send the payment prompt',
    body: 'Check your number and try again.',
  },
  network: {
    title: 'Could not reach the network',
    body: 'Check that you are still connected to the Wi-Fi, then try again.',
  },
  activation_failed: {
    title: 'You have paid, but we could not connect you',
    body: 'Tap Try again. If it still fails, call customer care and we will connect you.',
  },
}
