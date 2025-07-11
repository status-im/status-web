import { danger, success, white } from '@status-im/colors'

export const positiveColors = {
  line: success[50],
  background: 'transparent',
  marker: success['50/30'],
  fill: success['50/5'],
  white: white[100],
} as const

export const negativeColors = {
  line: danger[50],
  background: 'transparent',
  marker: danger['50/30'],
  fill: danger['50/5'],
  white: white[100],
} as const
