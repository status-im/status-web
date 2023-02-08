import { ChatMessage } from './chat-message'

import type { ReactionsType } from './types'

export * from './chat-message'

const reactions: ReactionsType = {
  love: new Set(['me', '1']),
  'thumbs-up': new Set(['3']),
  'thumbs-down': new Set(['me', '1', '2', '3']),
}

export const Messages = () => {
  return (
    <>
      <ChatMessage
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim. Nunc tincidunt ante vitae massa. Duis ante orci, molestie vitae, vehicula venenatis, tincidunt ac, pede. Nulla accumsan, elit sit"
        reactions={{}}
      />
      <ChatMessage
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. "
        reactions={{}}
      />
      <ChatMessage
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. "
        reactions={{}}
      />
      <ChatMessage
        images={[
          {
            url: 'https://images.unsplash.com/photo-1673433107234-14d1a4424658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          },
        ]}
        reactions={{}}
      />
      <ChatMessage text="fsdjkf kasldjf ksdlfjksdlfj asdklfj sdkljf" />
      <ChatMessage text="fsdjkf kasldjf ksdlfjksdlfj asdklfj sdkljf" />
      <ChatMessage
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim. Nunc tincidunt ante vitae massa. Duis ante orci, molestie vitae, vehicula venenatis, tincidunt ac, pede. Nulla accumsan, elit sit"
        reactions={reactions}
      />
      <ChatMessage
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.  "
        reactions={{}}
      />
      <ChatMessage
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.  "
        reactions={{}}
        reply
      />
      <ChatMessage
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.  "
        reactions={{}}
      />
      <ChatMessage
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim.sit"
        reactions={reactions}
        reply
      />
      <ChatMessage
        text="Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim.sit"
        reactions={reactions}
      />
      <ChatMessage
        images={[
          {
            url: 'https://images.unsplash.com/photo-1673433107234-14d1a4424658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          },
        ]}
      />
      <ChatMessage
        images={[
          {
            url: 'https://images.unsplash.com/photo-1673433107234-14d1a4424658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          },
        ]}
      />
    </>
  )
}
