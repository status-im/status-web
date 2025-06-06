import { LiFiWidget, type WidgetConfig } from '@lifi/widget'

const LifiWidget = () => {
  const widgetConfig: WidgetConfig = {
    integrator: 'status-wallet',
    appearance: 'light',
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.03)',
        borderRadius: '16px',
      },
    },
    // walletManagement: {
    // TODO: Add external wallet management
    //   signer: undefined,
    // },
  }

  return <LiFiWidget {...widgetConfig} />
}
export { LifiWidget }
