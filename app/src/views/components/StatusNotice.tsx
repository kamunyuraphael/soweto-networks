import { Icon } from './Icon'

/** Plain-language service notice. Replaces raw system errors like "RADIUS server is not responding". */
export function StatusNotice({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="flex items-start gap-2.5 rounded-xl bg-warn-bg px-3.5 py-3 text-sm text-warn-ink"
    >
      <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  )
}
