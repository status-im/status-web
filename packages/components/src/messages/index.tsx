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
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. "
        reactions={{}}
        reply
        pinned
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. "
        reactions={{}}
      />
      <Message
        images={[
          {
            url: 'https://images.unsplash.com/photo-1673433107234-14d1a4424658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          },
        ]}
        reactions={{}}
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim. Nunc tincidunt ante vitae massa. Duis ante orci, molestie vitae, vehicula venenatis, tincidunt ac, pede. Nulla accumsan, elit sit"
        reactions={reactions}
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.  "
        reactions={{}}
        pinned
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.  "
        reactions={{}}
        reply
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.  "
        reactions={{}}
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim.sit"
        reactions={reactions}
        reply
      />
      <Message
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim.sit"
        reactions={reactions}
      />
      <Message
        images={[
          {
            url: 'https://images.unsplash.com/photo-1673433107234-14d1a4424658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          },
        ]}
        reactions={{}}
      />
      <Message
        images={[
          {
            url: 'https://images.unsplash.com/photo-1673433107234-14d1a4424658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          },
        ]}
        reactions={{}}
      />
    </>
  )
}
