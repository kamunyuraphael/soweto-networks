import type { ReactNode } from 'react'
import { SupportFooter } from './SupportFooter'

/** Page frame shared by every screen: header slot, content, support footer. */
export function ScreenShell({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      {header}
      <main className="flex flex-1 flex-col gap-5 px-4 pb-8 pt-2">{children}</main>
      <SupportFooter />
    </div>
  )
}
