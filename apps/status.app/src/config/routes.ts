import gitHubIcon from '~public/images/social/github.svg'
// import statusIcon from '~public/images/social/status.svg'
import twitterIcon from '~public/images/social/twitter.svg'
import youTubeIcon from '~public/images/social/youtube.svg'

export const DISCUSS_URL = 'https://discuss.status.app'
export const DISCUSS_TRANSLATE_URL = `${DISCUSS_URL}/c/translate/76`
export const MESSARI_URL = 'https://messari.io/asset/status'
export const KEYCARD_STORE_URL = 'https://keycard.tech?buyKeycard=true'

export const STATUS_DESKTOP_REPO_ISSUES_URL =
  'https://github.com/status-im/status-app/issues/new?assignees=&labels=bug&projects=&template=bug.md'
export const STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON =
  '/api/download/macos-silicon'
export const STATUS_DESKTOP_DOWNLOAD_URL_MACOS_INTEL =
  '/api/download/macos-intel'
export const STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS = '/api/download/windows'
export const STATUS_DESKTOP_DOWNLOAD_URL_LINUX = '/api/download/linux'

export const STATUS_MOBILE_APP_STORE_URL =
  'https://apps.apple.com/us/app/status-privacy-super-app/id6754166924'
export const STATUS_MOBILE_GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=app.status.mobile&ref=our.status.im'
export const STATUS_MOBILE_F_DROID_URL =
  'https://f-droid.org/packages/im.status.ethereum'
export const STATUS_MOBILE_APK_URL = '/api/download/android'

export const STATUS_CONNECTOR_CHROME_URL =
  'https://chromewebstore.google.com/detail/kahehnbpamjplefhpkhafinaodkkenpg'

export const STATUS_PORTFOLIO_WALLET_CHROME_URL =
  'https://chromewebstore.google.com/detail/opkfeajbclhjdneghppfnfiannideafj'

// https://vercel.live/link/status-website-git-desktop-app-focus-status-im-web.vercel.app?page=%2F%3FvercelThreadId%3DfrG-m&via=in-app-copy-link&p=1
export const LEARN_MORE_MOBILE_APP_URL =
  'https://github.com/status-im/status-app/issues/18082'

export const ROUTES = {
  apps: [
    { nameKey: 'browser', href: '/#browser' },
    { nameKey: 'desktop', href: '/apps#desktop' },
    {
      nameKey: 'mobile',
      href: '/apps#mobile',
    },
    {
      nameKey: 'legacyMobile',
      href: 'https://status.app/blog/migrate-from-status-legacy-to-unified-status-mobile-app',
    },
  ],
  ecosystem: [
    { nameKey: 'keycard', href: '/keycard' },
    { nameKey: 'statusNetwork', href: 'https://status.network' },
  ],
  organization: [
    { nameKey: 'manifesto', href: '/manifesto' },
    { nameKey: 'team', href: '/team' },
    { nameKey: 'brand', href: '/brand' },
    { nameKey: 'jobs', href: '/jobs' },
  ],
  help: [
    { nameKey: 'overview', href: '/help' },
    { nameKey: 'gettingStarted', href: '/help/getting-started' },
    { nameKey: 'wallet', href: '/help/wallet' },
    {
      nameKey: 'profile',
      href: '/help/profile',
    },
    { nameKey: 'messaging', href: '/help/messaging' },
    { nameKey: 'communities', href: '/help/communities' },
    { nameKey: 'keycard', href: '/help/keycard' },
  ],
  collaborate: [
    { nameKey: 'discuss', href: DISCUSS_URL },
    {
      nameKey: 'requestFeature',
      href: 'https://discuss.status.app/c/features/51',
    },
    { nameKey: 'blog', href: '/blog' },
    { nameKey: 'translations', href: '/translations' },
  ],
  developers: [
    { nameKey: 'repos', href: 'https://github.com/status-im' },
    { nameKey: 'insights', href: '/insights/epics' },
    { nameKey: 'specs', href: '/specs' },
  ],
  snt: [
    { nameKey: 'token', href: '/snt' },
    { nameKey: 'releaseSchedule', href: '/snt/release-schedule' },
    // todo: replace with BASE_URL after merging https://github.com/status-im/status-website/pull/1108
    { nameKey: 'whitepaper', href: 'https://status.app/whitepaper.pdf' },
    { nameKey: 'governance', href: 'https://governance.status.app' },
    { nameKey: 'curate', href: 'https://curate.status.app' },
    { nameKey: 'exchanges', href: '/snt/exchanges' },
  ],
} as const

export const LEGAL = {
  termsOfUse: {
    nameKey: 'termsOfUse',
    href: '/legal/terms-of-use',
  },
  privacyPolicy: {
    nameKey: 'privacyPolicy',
    href: '/legal/privacy-policy',
  },
}

export const SECURITY = {
  nameKey: 'security',
  href: '/security',
}

export const SOCIALS = {
  // status: {
  //   name: 'Status',
  //   href: 'TODO',
  //   src: statusIcon,
  // },
  twitter: {
    nameKey: 'twitter',
    href: 'https://twitter.com/ethstatus',
    src: twitterIcon,
  },
  youtube: {
    nameKey: 'youTube',
    href: 'https://www.youtube.com/@Statusim',
    src: youTubeIcon,
  },
  github: {
    nameKey: 'gitHub',
    href: 'https://github.com/status-im',
    src: gitHubIcon,
  },
} as const

export type Routes = (typeof ROUTES)[keyof typeof ROUTES]
