export {
  LEGAL,
  MESSARI_URL,
  SECURITY,
  STATUS_CONNECTOR_CHROME_URL,
  STATUS_DESKTOP_DOWNLOAD_URL_LINUX,
  STATUS_DESKTOP_DOWNLOAD_URL_MACOS_INTEL,
  STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON,
  STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS,
  STATUS_MOBILE_APK_URL,
  STATUS_MOBILE_APP_STORE_URL,
  STATUS_MOBILE_F_DROID_URL,
  STATUS_MOBILE_GOOGLE_PLAY_URL,
  STATUS_PORTFOLIO_WALLET_CHROME_URL,
} from '../../../status.app/src/config/routes'

import type { SOCIALS as StatusAppSocials } from '../../../status.app/src/config/routes'

type Social = (typeof StatusAppSocials)[keyof typeof StatusAppSocials]

// No social links on the get site.
export const SOCIALS: Record<string, Social> = {}

export const ROUTES = {
  apps: [
    { nameKey: 'desktop', href: '/apps#desktop' },
    { nameKey: 'mobile', href: '/apps#mobile' },
  ],
} as const

export type Routes = (typeof ROUTES)[keyof typeof ROUTES]
