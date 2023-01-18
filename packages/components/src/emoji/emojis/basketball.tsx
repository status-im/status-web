import { memo } from 'react'

import { Defs, Image, Path, Pattern, Svg, Use } from 'react-native-svg'

import { themed } from '../themed'

import type { EmojiProps } from '../EmojiProps'

const Emoji = (props: EmojiProps) => {
  const { size = 16, ...otherProps } = props

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      {...otherProps}
    >
      <Path fill="url(#basketball-a)" d="M1.333 1.333h13.333v13.333H1.333z" />

      <Defs>
        <Pattern
          id="basketball-a"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use xlinkHref="#basketball-b" transform="scale(.01389)" />
        </Pattern>
        <Image
          id="basketball-b"
          width="72"
          height="72"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAY1BMVEVHcEz0kAz0kAz0kAz0kAz0kAz0kAwjHyD0kAz0kAz0kAz0kAz0kAz0kAz0kAzKeRAjHyCMWBZKNBzniQ0jHyDagg9kQhqmZhQwJh9xSRnNexCzbRI9LR5+UBeZXxXAdBFXOxt8YctEAAAAFXRSTlMAIGCPv9///1Cf70CvgM+fn////4DoPY5GAAAB20lEQVR4AdzSh46yQBQFYGlnYMACSBGxvP9T/t6JhuDxv4wbkk32pAP5uG2jJAijOAHMI0ASR2Gw+UHSLIHkBbkkWfqdEkQWAEESG/nXlRcACJpS5H7VZIAOAZlHVVuLZQh2u1TODliGJDu1qNTCF4JNlbYABaL8t709voOw/+wcTPkdVJrDZ8eYqvaH6sqYT9LRGJIUSBzJkfbVtCwRRE7bvO0usEDXy6uTH3SSp30H2Pk9uTscnHT2gc7OGdxl8gGhk9djvQzVozzs6JykMZeLvC+XoVKeXSCZNZfN/tTXS1DdzyrPXk4OydRcp0P8Vf6ECkyRkqolqJKCMKV4Toi6b3SooUkGDoroo6sOXelnkYMsld3qUEvtW3FS3myvQz3fSOp2P8vNPDJo0CAPbphFLiABL6nToI7XiMTtjHdbalDJFyJ7CwHQKFsNog8koSyfp33XoDvPWg4gBkBXMmrQSJcGIHaz5rVpEC/NTRvrQFgPMivlL0O391x/eWvrHeS/VuygAAAABkFgEPv39GUCL8QcwE5EHa2bETZsbGrR+Mt3RB4ke9kMIhTWMNBS6OdhdHicA48BsDOFUFKjNEuJn1RRL8de111AcEnDRRaYfVyIAmkMxDqQDwumcHXpGt5TKwAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

Emoji.displayName = 'Basketball'

export const Basketball = memo<EmojiProps>(themed(Emoji))
