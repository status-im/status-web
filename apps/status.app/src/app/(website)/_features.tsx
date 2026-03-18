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
  | 'extension'

type Feature = {
  theme: CustomisationColorType
  icon: IconElement
  nameKey:
    | 'communities'
    | 'createCommunity'
    | 'messenger'
    | 'wallet'
    | 'browser'
    | 'keycard'
    | 'extension'
}

export const features: Record<FeatureType, Feature> = {
  communities: {
    icon: <CommunitiesIcon className="text-customisation-turquoise-50" />,
    theme: 'turquoise',
    nameKey: 'communities',
  },
  'create-community': {
    icon: <CommunitiesIcon className="text-customisation-turquoise-60" />,
    theme: 'turquoise',
    nameKey: 'createCommunity',
  },
  messenger: {
    icon: <MessengerIcon className="text-customisation-purple-50" />,
    theme: 'purple',
    nameKey: 'messenger',
  },
  wallet: {
    icon: <WalletIcon className="text-customisation-yellow-50" />,
    theme: 'yellow',
    nameKey: 'wallet',
  },
  browser: {
    icon: <BrowserIcon className="text-customisation-magenta-50" />,
    theme: 'magenta',
    nameKey: 'browser',
  },
  keycard: {
    icon: <KeycardIcon className="text-customisation-army-50" />,
    theme: 'army',
    nameKey: 'keycard',
  },
  extension: {
    icon: <BrowserIcon className="text-customisation-blue-50" />,
    theme: 'blue',
    nameKey: 'extension',
  },
} as const
