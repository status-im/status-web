export {
  KEYCARD_STORE_URL,
  LEGAL,
  MESSARI_URL,
  SECURITY,
  SOCIALS,
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

export const ROUTES = {
  apps: [
    { nameKey: 'browser', href: '/#browser' },
    { nameKey: 'desktop', href: '/apps#desktop' },
    { nameKey: 'mobile', href: '/apps#mobile' },
    {
      nameKey: 'legacyMobile',
      href: 'https://status.app/blog/migrate-from-status-legacy-to-unified-status-mobile-app',
    },
  ],
} as const

export type Routes = (typeof ROUTES)[keyof typeof ROUTES]
