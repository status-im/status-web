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
      <Path fill="url(#a)" d="M1.333 1.333h13.333v13.333H1.333z" />
      <Defs>
        <Pattern
          id="a"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use xlinkHref="#b" transform="scale(.01389)" />
        </Pattern>
        <Image
          id="b"
          width="72"
          height="72"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAh1BMVEVHcEz0kAz0kAz0kAz0kAz0kAz0kAz0kAz0kAz0kAz0kAz0kAz0kAz0kAz0kAz0kAz/zE3/zE3/zE3/zE3/zE3/zE3/zE3/zE39wkL/zE3/zE3/zE3/zE30kAz/zE36ri33nxz+yEn+xUX5qij8vT32mxj9wUH3oyD1mBT6sjH1lBD7tjX8uTmQeifTAAAAHXRSTlMAMEBQv++PEM+A359gryBwzxDvv4CPUK9gIN9gMOUtXcUAAAKrSURBVHjarZfZkoIwEEWDLEkAcXfWDpu78//fN4OMqdAkJFCeJy3LI919OwJxJAtm5DUkENGXiGYAof8SUwwAERkPxV+K4I+AjvawoFdbAxtrYpAQBDiacB1c06SG+RiPBxpRAC2cuDMHgMQkgszZkz2a0W/bP4GzaAENuKsg8dwra0hJBx8kiXuIG2K8bJLQVaQbjwcKM3cRLo7KVlsTEGX9ti56Hnso/Vg3H5bSRsNDkFgCkIUJEklXwAATm0UBcPWNDaMn7UwimiyicUfkTxZxtIoxaLEnMkQ/YqstMHUIb6I/UcRw7Gegw7q1nkyxq2jR/b7X6UjiXBpeWj9SK4OQujcbzZz9h6i30jSEQRg+B2mnjtBzXZE5Pgd9mcbW1JbuMbDA8aw4/n3GOceao21oi2euLBdwqvLb4NDiZ9NgmFqIMscinDkX0VH8cToaSwtcRVA2pvJs2JCFDFYGFg7iQXtNOLteKEUULNxbUXlBlyQ9rqXlouWgFkcf18ABJohEAQoB5/MQpokOYEQfSJS/H/HkMrzFAW5uAR0qKaqHj14OHa7ijAIp+RneYh9UzkLkaPqSExjwSS9IlxI19SgUwMB/QBnu7E1p/Ela0Aeo1+iELkRDjj2aJBXK6+iZc+NeFYoHieqD5i6XqRfUUNa3pu93gcjV4Rb9/4JUM6GqFH2uarrumlvNUB49w1Sdc1Nza8JlZRZqNRRF/z+FxnI9nUy10rGYEoVUzsxGlefXSj0NUs0zVCVGUelulbKm32IkTaczgvCniXzSI5oiioiG+XjR3PCoP1ZkenSny3GeJSUGVm9jPG8rYmbn7tmRQfZrN816Tyx8bFw8mw9i5/3Tpvl8J06stuvBqraUOPO1NM78i4zje7fUWHbfZAKr/XazlI7Ndj8UnF+YwEpCshNBaAAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

Emoji.displayName = 'Fire'

export const Fire = memo<EmojiProps>(themed(Emoji))
