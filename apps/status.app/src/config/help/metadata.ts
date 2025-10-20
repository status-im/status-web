import { type ImageId } from '~components/assets'

export const METADATA = {
  'Getting started': {
    title: 'Getting started',
    icon: 'Help/Icons/01_Getting_Started:144:144' satisfies ImageId,
    description:
      'Find out what makes Status unique, run Status for the first time and discover essential app features.',
    href: '/help/getting-started',
    beta: false,
  },
  Wallet: {
    title: 'Wallet',
    icon: 'Help/Icons/04_Wallet:144:144' satisfies ImageId,
    description:
      'Status Wallet is an open-source non-custodial wallet that helps you store, send, receive and bridge crypto.',
    href: '/help/wallet',
    beta: false,
  },
  Profile: {
    title: 'Profile',
    icon: 'Help/Icons/05_Your_Profile_and_Preferences:144:144' satisfies ImageId,
    description:
      'Set up your Status profile and notifications, customize your settings and fix common issues.',
    href: '/help/profile',
    beta: false,
  },
  Messaging: {
    title: 'Messaging',
    icon: 'Help/Icons/02_Messaging_and_Web3_Browser:144:144' satisfies ImageId,
    description:
      'Send direct messages to your contacts, join or create group chats and make your point clear with GIFs, stickers, or pinned messages.',
    href: '/help/messaging',
    beta: true,
  },
  Communities: {
    title: 'Communities',
    icon: 'Help/Icons/03_Communities:144:144' satisfies ImageId,
    description:
      "Create your community, set up token-gated channels or join others' communities and channels.",
    href: '/help/communities',
    beta: true,
  },
  Keycard: {
    title: 'Keycard',
    icon: 'Help/Icons/06_Keycard:144:144' satisfies ImageId,
    description:
      'Protect your Status profile and Wallet accounts using the Keycard hardware wallet.',
    href: '/help/keycard',
    beta: true,
  },
} as const
