import { Stack } from '@tamagui/core'

import { Avatar } from '../avatar'
import { Button } from '../button'
import { Union } from '../icon'
import { Image } from '../image'
import { Heading, Paragraph } from '../typography'

interface Props {
  name: string
  description: string
  membersCount: number
}

const _Sidebar = (props: Props) => {
  const { name, description, membersCount } = props

  return (
    <Stack backgroundColor="$background">
      <Image
        src="https://images.unsplash.com/photo-1584475784921-d9dbfd9d17ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
        width={350}
        height={136}
      />
      <Stack
        paddingHorizontal={16}
        paddingBottom={16}
        marginTop={-16}
        backgroundColor="$background"
        borderTopLeftRadius={16}
        borderTopRightRadius={16}
        zIndex={10}
      >
        <Stack marginTop={-32} marginBottom={12}>
          <Avatar
            src="https://images.unsplash.com/photo-1553835973-dec43bfddbeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            size={56}
          />
        </Stack>
        <Heading marginBottom={16}>{name}</Heading>
        <Paragraph marginBottom={12}>{description}</Paragraph>
        <Stack flexDirection="row" alignItems="center" mb={12}>
          <Union color="$neutral-100" size={16} />
          <Paragraph ml={8}>{membersCount}</Paragraph>
        </Stack>
        <Button>Request to join community</Button>
      </Stack>
    </Stack>
  )
}

export const Sidebar = _Sidebar
