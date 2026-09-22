import type { PortalController } from '@/controllers/usePortalController'
import { formatLocal } from '@/lib/phone'
import { ConnectedDialog } from './dialogs/ConnectedDialog'
import { ConnectingDialog } from './dialogs/ConnectingDialog'
import { FailedDialog } from './dialogs/FailedDialog'
import { LoginDialog } from './dialogs/LoginDialog'
import { PaymentDialog } from './dialogs/PaymentDialog'
import { ReconnectDialog } from './dialogs/ReconnectDialog'
import { TvChoosePackageDialog } from './dialogs/TvChoosePackageDialog'
import { TvIntroDialog } from './dialogs/TvIntroDialog'
import { TvManualMacDialog } from './dialogs/TvManualMacDialog'
import { TvPickDeviceDialog } from './dialogs/TvPickDeviceDialog'
import { WaitingDialog } from './dialogs/WaitingDialog'
import { HomePage } from './pages/HomePage'

/**
 * The page (HomePage) is always mounted underneath; at most one dialog sits
 * on top of it, chosen by `state.status`. This matches the original site,
 * where every flow is a modal over the package grid.
 */
export function PortalView({ controller }: { controller: PortalController }) {
  const { state, notice, packages, nearbyDevices, devicesLoading, actions } = controller

  const home = (
    <HomePage
      packages={packages}
      notice={notice}
      onSelectPackage={actions.choosePackage}
      onStartTrial={actions.startTrial}
      onAlreadySubscribed={actions.openReconnect}
      onOpenTv={actions.openTvIntro}
    />
  )

  switch (state.status) {
    case 'idle':
      return home

    case 'paying':
      return (
        <>
          {home}
          <PaymentDialog
            key={state.pkg.id}
            pkg={state.pkg}
            device={state.device}
            initialPhone={state.phone}
            invalid={state.error === 'invalid_phone'}
            submitting={false}
            onSubmit={actions.submitPayment}
            onClose={actions.close}
          />
        </>
      )

    case 'requesting':
      return (
        <>
          {home}
          <PaymentDialog
            key={state.pkg.id}
            pkg={state.pkg}
            device={state.device}
            initialPhone={formatLocal(state.msisdn)}
            invalid={false}
            submitting
            onSubmit={actions.submitPayment}
            onClose={actions.close}
          />
        </>
      )

    case 'waiting':
      return (
        <>
          {home}
          <WaitingDialog
            pkg={state.pkg}
            msisdn={state.msisdn}
            step={state.step}
            startedAt={state.startedAt}
            onResend={actions.resendPrompt}
            onClose={actions.close}
          />
        </>
      )

    case 'connecting':
      return (
        <>
          {home}
          <ConnectingDialog onClose={actions.close} />
        </>
      )

    case 'connected':
      return (
        <>
          {home}
          <ConnectedDialog session={state.session} onClose={actions.close} />
        </>
      )

    case 'failed':
      return (
        <>
          {home}
          <FailedDialog reason={state.reason} onRetry={actions.retry} onClose={actions.close} />
        </>
      )

    case 'reconnect':
      return (
        <>
          {home}
          <ReconnectDialog onChoose={actions.chooseLoginMethod} onClose={actions.close} />
        </>
      )

    case 'login':
      return (
        <>
          {home}
          <LoginDialog
            method={state.method}
            error={state.error}
            submitting={state.submitting}
            onSubmit={actions.submitLogin}
            onBack={actions.openReconnect}
            onClose={actions.close}
          />
        </>
      )

    case 'tvIntro':
      return (
        <>
          {home}
          <TvIntroDialog onPickNearby={actions.openTvPick} onEnterMac={actions.openTvManual} onClose={actions.close} />
        </>
      )

    case 'tvPickDevice':
      return (
        <>
          {home}
          <TvPickDeviceDialog
            devices={nearbyDevices}
            loading={devicesLoading}
            onChoose={actions.chooseDevice}
            onBack={actions.openTvIntro}
            onClose={actions.close}
          />
        </>
      )

    case 'tvManualMac':
      return (
        <>
          {home}
          <TvManualMacDialog
            invalid={state.error === 'invalid_mac'}
            onSubmit={actions.submitManualMac}
            onBack={actions.openTvIntro}
            onClose={actions.close}
          />
        </>
      )

    case 'tvChoosePackage':
      return (
        <>
          {home}
          <TvChoosePackageDialog
            device={state.device}
            packages={packages}
            onSelect={(pkg) => actions.choosePackage(pkg, state.device)}
            onBack={actions.openTvIntro}
            onClose={actions.close}
          />
        </>
      )
  }
}
