import type { Package } from './package'

/**
 * Package catalog, in the order and wording of the original page.
 * This is display data: the billing backend is the source of truth for prices.
 */
export const PACKAGES: Package[] = [
  { id: 'happy-hour', name: 'Happy Hour Package', priceKsh: 5, duration: '1 Hour', durationMinutes: 60 },
  { id: 'hours-3', name: '3hrs for 1 device', priceKsh: 10, duration: '3 Hours', durationMinutes: 180 },
  {
    id: 'gamers',
    name: 'Gamers package(Double Speed)',
    priceKsh: 10,
    duration: '1 Hour 30 Minutes',
    durationMinutes: 90,
  },
  { id: 'hours-6', name: '6 hrs', priceKsh: 15, duration: '6 Hours', durationMinutes: 360 },
  { id: 'hours-12', name: '12 hrs', priceKsh: 25, duration: '12 Hours', durationMinutes: 720 },
  { id: 'hours-24', name: '24 HRS', priceKsh: 30, duration: '1 Day', durationMinutes: 1440 },
  { id: 'daily-dual', name: 'Daily Dual Device', priceKsh: 45, duration: '1 Day', durationMinutes: 1440 },
  { id: 'days-7', name: '7 Days', priceKsh: 150, durationMinutes: 10_080 },
  { id: 'fortnight', name: 'FORTNIGHT PACKAGE', priceKsh: 250, duration: '14 Days', durationMinutes: 20_160 },
  { id: 'month-1', name: '1 Month', priceKsh: 500, durationMinutes: 43_200 },
  {
    id: 'dual-month',
    name: 'Dual package (2 devices)',
    priceKsh: 900,
    duration: '1 Month',
    durationMinutes: 43_200,
  },
]
