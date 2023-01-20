import { AddReaction, Options, Reply } from '@status-im/icons/20'
import { Stack } from 'tamagui'

import { Button } from '../../button'

interface Props {
  onClick: VoidFunction
}
export const Actions = (_props: Props) => {
  return (
    <Stack
      backgroundColor="$white-100"
      borderWidth={1}
      borderColor="$neutral-10"
      borderRadius={10}
      overflow="hidden"
      position="absolute"
      top={-16}
      right={0}
      flexDirection="row"
      shadowRadius={20}
      shadowOffset={{ width: 0, height: 4 }}
      shadowColor="rgba(9, 16, 28, 0.08)"
      zIndex={10}
    >
      <Button type="ghost" icon={<AddReaction />} borderRadius={0} />
      <Button type="ghost" icon={<Reply />} borderRadius={0} />
      <Button type="ghost" icon={<Options />} borderRadius={0} />
    </Stack>
  )
}
