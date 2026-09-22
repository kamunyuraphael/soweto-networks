import { site } from '@/config/site'

export function PageHeader() {
  return (
    <header className="pb-2 pt-6 text-center">
      <h1 className="text-2xl font-extrabold uppercase tracking-wide">{site.brandName}</h1>
    </header>
  )
}
