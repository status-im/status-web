import { cloneElement } from 'react'

import { type ColorTokens, Stack, styled } from '@tamagui/core'

type Props = {
  children: React.ReactElement
  backgroundColor?: ColorTokens
  color?: ColorTokens
  size?: 20 | 32 | 48
}

const IconAvatar = (props: Props) => {
  const {
    children,
    color = '$blue-50',
    backgroundColor = '$blue-50-opa-20',
    size = 32,
  } = props
  return (
    <Base backgroundColor={backgroundColor} size={size}>
      {cloneElement(children, { color })}
    </Base>
  )
}

const Base = styled(Stack, {
  borderRadius: 80, // big enough to cover all sizes
  justifyContent: 'center',
  alignItems: 'center',

  variants: {
    size: {
      '...': (size: number) => {
        return {
          width: size,
          height: size,
        }
      },
    },
  },
})

export { IconAvatar }
export type { Props as IconAvatarProps }
