import { Stack } from '@tamagui/core'

import { DividerDate, DividerNewMessages } from '../dividers'
import { MessageSkeleton } from '../skeleton'
import { SystemMessage } from '../system-message'
import { Message } from './message'

import type { ReactionsType } from './types'

export * from './message'

const reactions: ReactionsType = {
  love: new Set(['me', '1']),
  'thumbs-up': new Set(['3']),
  'thumbs-down': new Set(['me', '1', '2', '3']),
}

type Props = {
  loading?: boolean
}

export const Messages = (props: Props) => {
  const { loading } = props

  if (loading) {
    return (
      <>
        <MessageSkeleton size="large" />
        <MessageSkeleton size="small" />
        <MessageSkeleton size="medium" />
        <MessageSkeleton size="large" />
        <MessageSkeleton size="medium" />
        <MessageSkeleton size="small" />
        <MessageSkeleton size="large" />
        <MessageSkeleton size="small" />
        <MessageSkeleton size="medium" />
      </>
    )
  }

  return (
    <>
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim. Nunc tincidunt ante vitae massa. Duis ante orci, molestie vitae, vehicula venenatis, tincidunt ac, pede. Nulla accumsan, elit sit"
        reactions={{}}
        id="1234-1234"
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. "
        reactions={{}}
        reply
        pinned
        id="1234-1235"
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. "
        reactions={{}}
        id="1234-1236"
      />
      <Message
        images={[
          {
            url: 'https://images.unsplash.com/photo-1673433107234-14d1a4424658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          },
        ]}
        reactions={{}}
        id="1234-1237"
      />
      <SystemMessage
        type="deleted"
        text="Messaged deleted for everyone"
        timestamp="9:45"
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim. Nunc tincidunt ante vitae massa. Duis ante orci, molestie vitae, vehicula venenatis, tincidunt ac, pede. Nulla accumsan, elit sit"
        reactions={reactions}
        id="1234-1238"
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.  "
        reactions={{}}
        pinned
        id="1234-1239"
      />
      <SystemMessage
        type="pinned"
        state="pressed"
        timestamp="9:45"
        user={{
          id: '123',
          name: 'Steve',
          src: 'https://images.unsplash.com/photo-1628196482365-8b8b2b2b2b1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        }}
        message={{
          text: 'Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit.',
          author: {
            id: '123',
            name: 'Alisher',
            src: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2lybHx8fHx8fDE2NzM4ODQ0NzU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
          },
        }}
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.  "
        reactions={{}}
        reply
        id="1234-1240"
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.  "
        reactions={{}}
        id="1234-1241"
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim.sit"
        reactions={reactions}
        reply
        id="1234-1242"
      />
      <Stack marginHorizontal={-8} marginVertical={8}>
        <DividerNewMessages color="$blue-50" />
      </Stack>
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim.sit"
        reactions={reactions}
        id="1234-1243"
      />
      <SystemMessage
        state="landed"
        type="deleted"
        text="Messaged deleted for you"
        timestamp="10:12"
      />
      <Message
        images={[
          {
            url: 'https://images.unsplash.com/photo-1673433107234-14d1a4424658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          },
        ]}
        reactions={{}}
        id="1234-1244"
      />
      <DividerDate label="Today" />
      <Message
        images={[
          {
            url: 'https://images.unsplash.com/photo-1673433107234-14d1a4424658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          },
        ]}
        reactions={{}}
        id="1234-1245"
      />
    </>
  )
}
