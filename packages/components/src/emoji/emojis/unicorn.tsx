import { memo } from 'react'

import {
  ClipPath,
  Defs,
  G,
  Image,
  Path,
  Pattern,
  Svg,
  Use,
} from 'react-native-svg'

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
      <G clipPath="url(#unicorn-a)">
        <Path fill="url(#unicorn-b)" d="M.667.667h14.667v14.667H.667z" />
      </G>
      <Defs>
        <ClipPath id="unicorn-a">
          <Path fill="#fff" d="M0 0h16v16H0z" />
        </ClipPath>
        <Pattern
          id="unicorn-b"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use xlinkHref="#unicorn-c" transform="scale(.01389)" />
        </Pattern>
        <Image
          id="unicorn-c"
          width="72"
          height="72"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAwFBMVEVHcEx6QYTBzdXBzdXBzdVgN5pgN5rBzdW2n6fENRJgN5rBzdVgN5rBzdXBzdVgN5rBzdXufA7seA5gN5rBzdXBzdXBzdXBzdXufA7MQhHaWhDteQ5gN5rWUxDHOhF1V6fufA7XVhDNgFzBzdW8xs9gN5rufA6prMSyvMbncRCImKORgrhTYmyCbK9pRaDIPBOfmMF2iJYqMDSaqLFga3N0VqbboGV6g4nbYBTlhi6ESHc8Q0ewXkvMuaPHsKSuipHrwtT2AAAAI3RSTlMAIO8wfdN9QBD+W983v1zvn2bpqq+PIM+WpzDDj0DP36/Pz9/s0Q4AAAK6SURBVHhe7ZbXUuMwFIblFsuOU0ghlLCweyTXkkpnd9//rVbGFMtYsgwZrvYbbpjJfHP+o19K0MnVEToIR74/OYzqxD+U6spn/Lz4ugif+37kOKfaIdKtnJU/OcFfNp06zl2xqmo+Qzd4geb2SlxNYmIexqqSz4b+q8nrWdZS8+gb7D9xCxh3jlNUwThGDAMAxjZC7pQyRnTkjmiFqSYyTfyo2JR/fjaAebEtgBBgcEnf4ER05AlMZxPmiXzGLwL63EAzstkRgISKcEWmH6XHX63+AMBiAMEmZqa12CQpVLmp6IbAOicQM5NkJpbOW2LRdYlWRRXu/1KasJE2MQAEzyRZXjdZGFmW1nx40eumnmgespE2AbwTJDXXEk0FW79wWDC/jPiQQViMxLHmVVqPJcTNK2eekigECOMd1OCmmnpFQvHKS26gkeC6YvLKhDU09teznlpEQLJKBUod4umVwR9e0v0GEcl7NkqbwlkvpntJMkalpVZzN3FpyggzsVIK4VvauG93ao0uCbST8SbURB9UuG4VDUEJkreJBqDGukWEgUNxTdJkZL/dE2k4qWgMr9xut9tbxXDSM+NF8pOTrih83D6GICOQiGyosGstk1hkQhcCZZHqSII6qrMWihbQCZKLRNCRTCA6ho4EApENXcmbRSZ0JWkWzaArYbNIBw7lKnV4HfvSKnVIZkurpH74fXFVs4+iMQgZI1NWJfU22siQVUm5RHPZ911SE2FdEowxk1RJ7ez1YcvAGVV5imbD1nu45kUAQUzqNRwqPTE5f/HDNN3zpgVW+3WR8KI4TdMdNw9WfIbJR1FcXbKhXA++juE+TcOKyFS/0vzktZ/VOlZ/PqWfM5G6SHZndfxpEV4INt1VhPBc5lEXMexZqRlj1F3Eg20GL1AXyTm8yPw+0X/R+FCiwTdE+weFN6s3Jd7QlgAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

Emoji.displayName = 'Unicorn'

export const Unicorn = memo<EmojiProps>(themed(Emoji))
