import type { Account } from '../_components/sidenav'
import type { CustomisationColorType } from '@status-im/components'

const ACCOUNT_EMOJIS = [
  '🏠',
  '🏡',
  '🏢',
  '🏦',
  '💰',
  '💸',
  '💵',
  '💎',
  '🔑',
  '🔒',
  '🛡️',
  '🔐',
  '🚀',
  '⭐',
  '🌟',
  '✨',
  '🐱',
  '🐶',
  '🐻',
  '🍀',
  '🌈',
  '🌞',
  '🌙',
]

export const COLORS: CustomisationColorType[] = [
  'blue',
  'yellow',
  'orange',
  'purple',
  'army',
  'camel',
  'copper',
  'magenta',
  'pink',
  'sky',
]

const getRandomEmoji = (): string => {
  return ACCOUNT_EMOJIS[Math.floor(Math.random() * ACCOUNT_EMOJIS.length)]
}

const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

const getDefaultValues = (): Account => {
  return {
    emoji: getRandomEmoji(),
    color: getRandomColor(),
    name: '',
    address: '',
  }
}

export { getDefaultValues, getRandomColor, getRandomEmoji }
