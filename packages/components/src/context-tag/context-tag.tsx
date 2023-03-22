import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Avatar } from '../avatar'
import { Text } from '../text'

type ContextTagProps = {
  children: React.ReactNode
  icon?: string
}

const StyledView = styled(View, {
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

export const ContextTag = ({ icon, children }: ContextTagProps) => {
  return (
    <StyledView>
      {icon && <Avatar size={20} src={icon} />}
      <Text size={11} weight="medium" color="$neutral-100">
        {children}
      </Text>
    </StyledView>
  )
}
