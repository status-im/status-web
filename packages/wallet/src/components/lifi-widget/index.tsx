import { LiFiWidget, type WidgetConfig } from '@lifi/widget'
import { useConfig } from 'wagmi'

const LifiWidget = () => {
  const { chains } = useConfig()

  const widgetConfig: WidgetConfig = {
    integrator: 'status-wallet',
    appearance: 'light',
    chains: {
      allow: chains.map(chain => chain.id),
    },
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.03)',
        borderRadius: '16px',
      },
    },
  }

  return <LiFiWidget {...widgetConfig} />
}
export { LifiWidget }
