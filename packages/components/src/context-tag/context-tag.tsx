import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Badge } from '../badge'
import { Paragraph } from '../typography'

type ContextTagProps = {
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
})

const InsideView = styled(View, {
  flexDirection: 'row',
  gap: 10,
})

const Truncate = styled(Paragraph, {
  display: 'inline-flex',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '200px',
})

export const ContextTag = ({ icon, children, count }: ContextTagProps) => {
  return (
    <StyledView>
      <InsideView>
        {icon}
        <Truncate color="$textPrimary">{children}</Truncate>
      </InsideView>
      {count ? <Badge value={count} /> : null}
    </StyledView>
  )
}
