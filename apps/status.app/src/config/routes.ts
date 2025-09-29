import gitHubIcon from '~public/images/social/github.svg'
// import statusIcon from '~public/images/social/status.svg'
import twitterIcon from '~public/images/social/twitter.svg'
import youTubeIcon from '~public/images/social/youtube.svg'

export const DISCUSS_URL = 'https://discuss.status.app'
export const DISCUSS_TRANSLATE_URL = `${DISCUSS_URL}/c/translate/76`
export const MESSARI_URL = 'https://messari.io/asset/status'
export const KEYCARD_STORE_URL = 'https://keycard.tech?buyKeycard=true'

export const STATUS_DESKTOP_REPO_ISSUES_URL =
  'https://github.com/status-im/status-desktop/issues/new?assignees=&labels=bug&projects=&template=bug.md'
export const STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON =
  '/api/download/macos-silicon'
export const STATUS_DESKTOP_DOWNLOAD_URL_MACOS_INTEL =
  '/api/download/macos-intel'
export const STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS = '/api/download/windows'
export const STATUS_DESKTOP_DOWNLOAD_URL_LINUX = '/api/download/linux'

export const STATUS_MOBILE_APP_STORE_URL =
  'https://apps.apple.com/us/app/status-private-communication/id1178893006'
export const STATUS_MOBILE_GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=im.status.ethereum&pcampaignid=web_share'
export const STATUS_MOBILE_F_DROID_URL =
  'https://f-droid.org/packages/im.status.ethereum'
export const STATUS_MOBILE_APK_URL = '/api/download/android'

export const STATUS_CONNECTOR_CHROME_URL =
  'https://chromewebstore.google.com/detail/kahehnbpamjplefhpkhafinaodkkenpg'

// https://vercel.live/link/status-website-git-desktop-app-focus-status-im-web.vercel.app?page=%2F%3FvercelThreadId%3DfrG-m&via=in-app-copy-link&p=1
export const LEARN_MORE_MOBILE_APP_URL =
  'https://github.com/status-im/status-desktop/issues/18082'

export const ROUTES = {
  Apps: [
    { name: 'Mobile', href: '/apps#mobile' },
    { name: 'Desktop', href: '/apps#desktop' },
  ],
  Ecosystem: [
    { name: 'Keycard', href: '/keycard' },
    { name: 'Status Network', href: 'https://status.network' },
  ],
  Organization: [
    { name: 'Manifesto', href: '/manifesto' },
    { name: 'Team', href: '/team' },
    { name: 'Brand', href: '/brand' },
    { name: 'Jobs', href: '/jobs' },
  ],
  Help: [
    { name: 'Overview', href: '/help' },
    { name: 'Getting started', href: '/help/getting-started' },
    { name: 'Wallet', href: '/help/wallet' },
    {
      name: 'Profile',
      href: '/help/profile',
    },
    { name: 'Messaging', href: '/help/messaging' },
    { name: 'Communities', href: '/help/communities' },
    { name: 'Keycard', href: '/help/keycard' },
  ],
  Collaborate: [
    { name: 'Discuss', href: DISCUSS_URL },
    {
      name: 'Request a feature',
      href: 'https://discuss.status.app/c/features/51',
    },
    { name: 'Blog', href: '/blog' },
    { name: 'Translations', href: '/translations' },
  ],
  Developers: [
    { name: 'Repos', href: 'https://github.com/status-im' },
    { name: 'Insights', href: '/insights/epics' },
    { name: 'Specs', href: '/specs' },
  ],
  SNT: [
    { name: 'Token', href: '/snt' },
    { name: 'Release schedule', href: '/snt/release-schedule' },
    // todo: replace with BASE_URL after merging https://github.com/status-im/status-website/pull/1108
    { name: 'Whitepaper', href: 'https://status.app/whitepaper.pdf' },
    { name: 'Governance', href: 'https://governance.status.app' },
    { name: 'Curate', href: 'https://curate.status.app' },
    { name: 'Exchanges', href: '/snt/exchanges' },
  ],
} as const

export const LEGAL = {
  termsOfUse: {
    name: 'Terms of Use',
    href: '/legal/terms-of-use',
  },
  privacyPolicy: {
    name: 'Privacy Policy',
    href: '/legal/privacy-policy',
  },
}

export const SECURITY = {
  name: 'Security',
  href: '/security',
}

export const SOCIALS = {
  // status: {
  //   name: 'Status',
  //   href: 'TODO',
  //   src: statusIcon,
  // },
  twitter: {
    name: 'Twitter',
    href: 'https://twitter.com/ethstatus',
    src: twitterIcon,
  },
  youtube: {
    name: 'YouTube',
    href: 'https://www.youtube.com/@Statusim',
    src: youTubeIcon,
  },
  github: {
    name: 'GitHub',
    href: 'https://github.com/status-im',
    src: gitHubIcon,
  },
} as const

export type Routes = (typeof ROUTES)[keyof typeof ROUTES]
