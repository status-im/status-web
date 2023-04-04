import { Stack, styled } from '@tamagui/core'
import { View } from 'react-native'

import { Counter } from '../counter'
import { Text } from '../text'

import type { ColorTokens } from '@tamagui/core'

type Props = {
  children: React.ReactNode
  icon?: React.ReactNode
  count?: number
  backgroundColor?: ColorTokens
}

const Banner = (props: Props) => {
  const {
    icon = null,
    children,
    count,
    backgroundColor = '$primary-50-opa-20',
  } = props

  return (
    <Base backgroundColor={backgroundColor}>
      <Content>
        {icon}
        <Stack flexGrow={1} flexShrink={1}>
          <Text size={13} color="$textPrimary" truncate>
            {children}
          </Text>
        </Stack>
      </Content>
      {count ? <Counter value={count} /> : null}
    </Base>
  )
}

export { Banner }
export type { Props as BannerProps }

const Base = styled(View, {
  padding: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxHeight: '40px',
  gap: 10,
})

const Content = styled(View, {
  flexDirection: 'row',
  gap: 10,
  alignItems: 'center',
  width: '90%', // truncate does work without this ¯\_(ツ)_/¯
})
