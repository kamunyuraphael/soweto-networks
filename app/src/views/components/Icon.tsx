/**
 * Inline SVG icons (24px grid, 2px stroke). Inline on purpose: no icon font or
 * image requests before login, and they render identically on every phone.
 */
const PATHS = {
  login: [
    'M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2',
    'M21 12h-13l3 -3',
    'M11 15l-3 -3',
  ],
  key: ['M4 15a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M11 12l9 -9', 'M16 7l3 3', 'M13.5 9.5l2 2'],
  ticket: [
    'M15 5v2',
    'M15 11v2',
    'M15 17v2',
    'M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2',
  ],
  receipt: [
    'M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2',
    'M14.8 8h-3.6a1.6 1.6 0 0 0 0 3.2h1.6a1.6 1.6 0 0 1 0 3.2h-3.6',
    'M12 6.5v1.5',
    'M12 14.4v1.5',
  ],
  tv: [
    'M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9z',
    'M16 3l-4 4l-4 -4',
  ],
  sparkles: [
    'M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2z',
    'M16 6a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2z',
    'M9 18a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z',
  ],
  phone: [
    'M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2',
  ],
  wifi: [
    'M12 18h.01',
    'M9.172 15.172a4 4 0 0 1 5.656 0',
    'M6.343 12.343a8 8 0 0 1 11.314 0',
    'M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0',
  ],
  x: ['M18 6l-12 12', 'M6 6l12 12'],
  chevronLeft: ['M15 6l-6 6l6 6'],
  chevronRight: ['M9 6l6 6l-6 6'],
} as const

export type IconName = keyof typeof PATHS

interface IconProps {
  name: IconName
  className?: string
}

export function Icon({ name, className = 'size-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
