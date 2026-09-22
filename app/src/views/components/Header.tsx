import { site } from '@/config/site'
import { Button } from './Button'
import { Icon } from './Icon'

export function BrandHeader({ onLogin }: { onLogin?: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 pb-3 pt-5">
      <h1 className="text-xl font-semibold tracking-tight">{site.brandName}</h1>
      {onLogin && (
        <Button variant="link" onClick={onLogin}>
          <Icon name="login" className="size-4" />
          Log in
        </Button>
      )}
    </header>
  )
}

export function BackHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="px-2 pb-1 pt-3">
      <Button variant="link" onClick={onBack} className="text-muted">
        <Icon name="chevronLeft" className="size-5" />
        Back
      </Button>
    </header>
  )
}
