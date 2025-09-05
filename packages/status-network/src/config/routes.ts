import gitHubIcon from '../assets/social/github.svg'
import statusIcon from '../assets/social/status.svg'
import twitterIcon from '../assets/social/twitter.svg'

export const BRAND = {
  name: 'Brand assets',
  href: '/brand',
}

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
