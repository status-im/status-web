import gitHubIcon from '~public/social/github.svg'
import statusIcon from '~public/social/status.svg'
import twitterIcon from '~public/social/twitter.svg'

export const STATUS_URL = 'https://status.im'
export const KEYCARD_URL = 'https://keycard.tech'
export const NIMBUS_URL = 'https://nimbus.team'
export const WAKU_URL = 'https://waku.org'
export const CODEX_URL = 'https://codex.storage'

export const LINEA_URL = 'https://linea.build'
export const GATEWAY_URL = 'https://gateway.fm'
export const CATS_FISHING_URL = 'https://cats.fishing'
export const SPLA_LABS_URL = 'https://splalabs.xyz'
export const DIN_URL = 'https://infura.io'

export const ROUTES = {
  Navigation: [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Partners', href: '#partners' },
    { name: 'Network', href: '#network' },
    { name: 'Tokenomics', href: '#tokenomics' },
    { name: 'Blog', href: '#blog' },
  ],
  Docs: 'https://docs.status.network/',
  Bridge: 'https://bridge.status.network/ ',
  Partner: 'https://statusnetwork.typeform.com/partner',
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

export const FEATURES = {
  sustainablePublicFunding: {
    name: 'Discover Karmic Tokenomics',
    href: 'https://docs.status.network/tokenomics/karmic-tokenomics',
  },
  gaslessTransactions: {
    name: 'Learn how it works',
    href: 'https://docs.status.network/tokenomics/economic-model',
  },
  performance: {
    name: 'Learn more about Linea',
    href: LINEA_URL,
  },
}

export const BRAND = {
  name: 'Brand assets',
  href: '/brand',
}

export const SOCIALS = {
  status: {
    name: 'Status',
    href: 'https://status.app',
    src: statusIcon,
  },
  twitter: {
    name: 'Twitter',
    href: 'https://x.com/StatusL2',
    src: twitterIcon,
  },

  github: {
    name: 'GitHub',
    href: 'https://github.com/status-im',
    src: gitHubIcon,
  },
} as const

export type Routes = (typeof ROUTES)[keyof typeof ROUTES]
