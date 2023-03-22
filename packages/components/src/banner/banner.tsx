import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Badge } from '../badge'
import { Text } from '../text'

type BannerProps = {
  children: React.ReactNode
  icon?: React.ReactNode
  count?: number
}

const StyledView = styled(View, {
  backgroundColor: '$primary-50-opa-20',
  padding: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxHeight: '50px',
})

const InsideView = styled(View, {
  flexDirection: 'row',
  gap: 10,
})

export const Banner = ({ icon, children, count }: BannerProps) => {
  return (
    <StyledView>
      <InsideView>
        {icon}
        <Text size={13} color="$textPrimary">
          {children}
        </Text>
      </InsideView>
      {count ? <Badge value={count} /> : null}
    </StyledView>
  )
}
