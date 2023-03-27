import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Avatar } from '../avatar'
import { Text } from '../text'

type Props = {
  children: React.ReactNode
  icon?: string
}

const ContextTag = (props: Props) => {
  const { icon, children } = props

  return (
    <Base>
      {icon && <Avatar size={20} src={icon} />}
      <Text size={11} weight="medium" color="$neutral-100">
        {children}
      </Text>
    </Base>
  )
}

export { ContextTag }
export type { Props as ContextTagProps }

const Base = styled(View, {
  backgroundColor: '$neutral-10',
  paddingLeft: 3,
  paddingRight: 8,
  paddingVertical: 3,
  borderRadius: 20,
  display: 'inline-flex',
  space: 4,
  flexDirection: 'row',
  alignItems: 'center',
})
