import {
  BrowserIcon,
  CommunitiesIcon,
  KeycardIcon,
  MessengerIcon,
  WalletIcon,
} from '@status-im/icons/20'

import type { CustomisationColorType, IconElement } from '@status-im/components'

export type FeatureType =
  | 'communities'
  | 'create-community'
  | 'wallet'
  | 'messenger'
  | 'browser'
  | 'keycard'

type Feature = {
  theme: CustomisationColorType
  icon: IconElement
  name: string
}

export const features: Record<FeatureType, Feature> = {
  communities: {
    icon: <CommunitiesIcon className="text-customisation-turquoise-50" />,
    theme: 'turquoise',
    name: 'Communities',
  },
  'create-community': {
    icon: <CommunitiesIcon className="text-customisation-turquoise-60" />,
    theme: 'turquoise',
    name: 'Create community',
  },
  messenger: {
    icon: <MessengerIcon className="text-customisation-purple-50" />,
    theme: 'purple',
    name: 'Messenger',
  },
  wallet: {
    icon: <WalletIcon className="text-customisation-yellow-50" />,
    theme: 'yellow',
    name: 'Wallet',
  },
  browser: {
    icon: <BrowserIcon className="text-customisation-magenta-50" />,
    theme: 'magenta',
    name: 'Browser',
  },
  keycard: {
    icon: <KeycardIcon className="text-customisation-army-50" />,
    theme: 'army',
    name: 'Keycard',
  },
} as const
