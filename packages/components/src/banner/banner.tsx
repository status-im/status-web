import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Counter } from '../counter'
import { Text } from '../text'

type Props = {
  children: React.ReactNode
  icon?: React.ReactNode
  count?: number
}

const Banner = (props: Props) => {
  const { icon, children, count } = props

  return (
    <Base>
      <Content>
        {icon}
        <Text size={13} color="$textPrimary">
          {children}
        </Text>
      </Content>
      {count ? <Counter value={count} /> : null}
    </Base>
  )
}

export { Banner }
export type { Props as BannerProps }

const Base = styled(View, {
  backgroundColor: '$primary-50-opa-20',
  padding: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxHeight: '40px',
})

const Content = styled(View, {
  flexDirection: 'row',
  gap: 10,
  alignItems: 'center',
})
