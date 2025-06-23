import { LiFiWidget, type WidgetConfig } from '@lifi/widget'

type Props = {
  config?: Partial<WidgetConfig>
}

const LifiWidget = ({ config = {} }: Props) => {
  const widgetConfig: WidgetConfig = {
    integrator: 'status-wallet',
    appearance: 'light',
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.03)',
        borderRadius: '16px',
      },
    },
    ...config,
  }

  return <LiFiWidget {...widgetConfig} />
}

export { LifiWidget, type WidgetConfig }
