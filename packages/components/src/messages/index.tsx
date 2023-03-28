import { Stack } from '@tamagui/core'

import { DividerDate, NewMessages } from '../dividers'
import { PinAnnouncement } from '../system-messages'
import { Message } from './message'

import type { ReactionsType } from './types'

export * from './message'

const reactions: ReactionsType = {
  love: new Set(['me', '1']),
  'thumbs-up': new Set(['3']),
  'thumbs-down': new Set(['me', '1', '2', '3']),
}

export const Messages = () => {
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
      <PinAnnouncement
        name="Steve"
        message={{
          text: 'Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit.',
          reactions: {},
          reply: true,
          pinned: true,
          id: '1234-1235',
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
        <NewMessages color="$blue-50" />
      </Stack>
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim.sit"
        reactions={reactions}
        id="1234-1243"
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
