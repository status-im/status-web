import { Providers } from './_providers'

type Props = {
  children: React.ReactNode
}

export default function PortfolioLayout(props: Props) {
  const { children } = props

  return (
    <Providers>
      {children}
      <script
        suppressHydrationWarning
        // nonce={typeof window === 'undefined' ? nonce : ''}
        dangerouslySetInnerHTML={{ __html: `(${platformScript.toString()})()` }}
      />
    </Providers>
  )
}

// inspired by the implementation of next-themes
// https://github.com/pacocoursey/next-themes/blob/main/next-themes/src/index.tsx
const platformScript = () => {
  // if ('userAgentData' in window.navigator && window.navigator.userAgentData) {
  //   const platform = window.navigator.userAgentData.platform.toLowerCase()
  //   if (platform.includes('mac')) {
  //     document.body.setAttribute('data-platform', 'macos')
  //   } else if (platform.includes('win')) {
  //     document.body.setAttribute('data-platform', 'windows')
  //   } else if (platform.includes('linux')) {
  //     document.body.setAttribute('data-platform', 'linux')
  //   }
  // }

  const userAgent = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(userAgent)) {
    document.body.setAttribute('data-platform', 'ios')
  } else if (userAgent.includes('mac')) {
    document.body.setAttribute('data-platform', 'macos')
  } else if (userAgent.includes('win')) {
    document.body.setAttribute('data-platform', 'windows')
  } else if (userAgent.includes('android')) {
    document.body.setAttribute('data-platform', 'android')
  } else if (userAgent.includes('linux')) {
    document.body.setAttribute('data-platform', 'linux')
  } else {
    document.body.setAttribute('data-platform', 'unknown')
  }
}
