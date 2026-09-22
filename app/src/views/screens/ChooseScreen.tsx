import { site } from '@/config/site'
import type { Package, PackageGroup } from '@/models/package'
import { BrandHeader } from '../components/Header'
import { PackageList } from '../components/PackageList'
import { ScreenShell } from '../components/ScreenShell'
import { StatusNotice } from '../components/StatusNotice'
import { TrialBanner } from '../components/TrialBanner'

interface ChooseScreenProps {
  groups: PackageGroup[]
  notice: string | null
  onSelect: (pkg: Package) => void
  onStartTrial: () => void
  onLogin: () => void
}

export function ChooseScreen({ groups, notice, onSelect, onStartTrial, onLogin }: ChooseScreenProps) {
  return (
    <ScreenShell header={<BrandHeader onLogin={onLogin} />}>
      {notice && <StatusNotice message={notice} />}
      <TrialBanner minutes={site.trial.minutes} onStart={onStartTrial} />
      <PackageList groups={groups} onSelect={onSelect} />
    </ScreenShell>
  )
}
