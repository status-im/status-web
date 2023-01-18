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
      <G clipPath="url(#peach-a)">
        <Path fill="url(#peach-b)" d="M.667.667h14.667v14.667H.667z" />
      </G>
      <Defs>
        <ClipPath id="peach-a">
          <Path fill="#fff" d="M0 0h16v16H0z" />
        </ClipPath>
        <Pattern
          id="peach-b"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use xlinkHref="#peach-c" transform="scale(.01389)" />
        </Pattern>
        <Image
          id="peach-c"
          width="72"
          height="72"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAwFBMVEVHcExlnER3slV3slV3slV3slVvqU53slV3slV3slV3slVnnkV3slVup0xckTtckTtckTtckTtckTtckTt3slVckTtyrFBwkEGPjkqyjVXYimDpjmf/iGyZjk2Ar1aujVT/iGz/iGz/iGyhpVyOq1nvXFndLkTsVVb/iGz/iGz/iGz3i2vCm2KipVzqTVL/iGzRl2TyZl3/iGz/iGzfNEf7e2biO0r/iGz9gmr/iGz/iGz3cmLmRU7/iGz/iGz/iGyyzkZtAAAAQHRSTlMAQIC/n2YwUK//3xDvIIi//8+vY8/t////+///////QJ8wEM//////71Bg/////4D//3DP////3/8gj///r0C/62GdZgAAAmhJREFUeAGc0FWChTAMBdDg1Ghwt/0vcnyeNEXPd/QC4bjeDz8I4b4oZi+4K+CWgDODdOFJJRq/pFke7l/DmUXx3yQyfCpzARuUx+zk76SwxDdlDlaBZGxvkirRpBUQImY7pALQSJUOGELOdnngoJXxXiTZgSBDK/0eDzvEkaJ5++xQVTdt23VdPwxD33XtWCNiIsCgjkZN/WDq2hkoOorOoZb1s9uysLIbiKHo9BEteD6bmaH/rmItw9P3KJy9BdwzAssPq7QeVlmo2t1Cz549h+PxBEznCxD5FIT7z54ooJXjSkyABHiYNPpQVkgPHEXTPfIw/KxXDT+HOR2Z07bJO9Mr38LodrVEKWueOByZjAC5eUNBIm/fVFYE8F49CW0Ts6kmQGPNE/ZM27Q1mw5XR5eQC1XJxbVonbon0ZmcOIg70JsHLuTIQ3Go32drmHtyZBC75CsqY0buEgEm9njkTCZuJdeWkzul1O5ZbJG836W0SgsxinYPQpPOpKAU5lasItIwSk3Sini7R1mkXAAssqRh+AMi80VF51XU/ArRwp+IXoRvZK8X4cuW/4qF7OBh038iherUMicsylXHnxlxlrCvSUTxRzqgRKKsrcUXsnsS3eumX4kRqVMNrRR+/cy9/tLipNVpWnSAO/REotjrSiyMKZwrq1F+eMUjByoQbXuQs91iZCWEY8XkQP4vrHEyAdGAPTrTgWcPPMCkYgIeRcdBnwFeQ67k5iq2JyfOs9lidnnUYo0D+Zk2SIwbNrn6qsIz7vgFCZwTo8Pr4bOmzqgBrmI2P0jn378W2fjm55jzZFk2NN8BIrOmWnrNWn4AAAAASUVORK5CYII="
        />
      </Defs>
    </Svg>
  )
}

Emoji.displayName = 'Peach'

export const Peach = memo<EmojiProps>(themed(Emoji))
