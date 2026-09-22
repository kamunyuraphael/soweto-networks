/** Red banner at the top of the page when the network service has a problem. */
export function StatusBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-xl border border-bad-line bg-bad-bg px-4 py-3 text-sm text-bad-ink">
      {message}
    </div>
  )
}
