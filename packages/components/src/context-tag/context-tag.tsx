import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Paragraph } from '../typography'

type ContextTagProps = {
  children: React.ReactNode
}

const StyledView = styled(View, {
  backgroundColor: '$neutral-10',
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 10,
  display: 'inline',
})

export const ContextTag = ({ children }: ContextTagProps) => {
  return (
    <StyledView>
      <Paragraph size={12} weight="medium" color="$neutral-100">
        {children}
      </Paragraph>
    </StyledView>
  )
}
