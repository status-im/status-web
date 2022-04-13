interface BaseMessage {
  id: string
  type: 'text' | 'image' | 'image-text'
  contact: {
    name: string
    imageUrl?: string
  }
  owner: boolean
  pinned: boolean
  mention: boolean
  reply?: TextReply | ImageReply | ImageTextReply
}

interface TextMessage extends BaseMessage {
  type: 'text'
  text: string
}

interface ImageMessage extends BaseMessage {
  type: 'image'
  imageUrl: string
}
interface ImageTextMessage extends BaseMessage {
  type: 'image-text'
  text: string
  imageUrl: string
}

export type Message = TextMessage | ImageMessage | ImageTextMessage

interface BaseReply {
  type: Message['type']
  contact: {
    name: string
    imageUrl?: string
  }
}

interface TextReply extends BaseReply {
  type: 'text'
  text: string
}

interface ImageReply extends BaseReply {
  type: 'image'
  imageUrl: string
}

interface ImageTextReply extends BaseReply {
  type: 'image-text'
  text: string
  imageUrl: string
}

export type Reply = TextReply | ImageReply | ImageTextReply

export const useMessages = (): Message[] => {
  return [
    {
      id: '1',
      type: 'text',
      contact: {
        name: 'Leila Joyner',
        imageUrl:
          'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjI0OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      },
      text: 'lorem, sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec dignissim magna a tortor. Nunc commodo auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium neque. Morbi',
      owner: false,
      pinned: true,
      mention: false,
      reply: {
        contact: {
          name: 'Leila Joyner',
          imageUrl:
            'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjI0OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        },
        type: 'text',
        text: 'lorem, sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec dignissim magna a tortor. Nunc commodo auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium neque. Morbi',
      },
    },
    {
      id: '2',
      type: 'text',
      contact: {
        name: 'Velma Mccarthy',
        imageUrl:
          'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjMwOQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      },
      text: 'est tempor bibendum. Donec felis orci, adipiscing non, luctus sit amet, faucibus ut, nulla. Cras eu tellus eu augue porttitor interdum. Sed auctor odio a purus. Duis elementum, dui quis accumsan convallis, ante lectus convallis est, vitae sodales nisi magna sed dui. Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit neque. In ornare sagittis felis. Donec tempor, est ac mattis semper, dui lectus rutrum urna, nec luctus felis',
      owner: false,
      pinned: false,
      mention: false,
      reply: {
        contact: {
          name: 'Leila Joyner',
          imageUrl:
            'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjI0OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        },
        type: 'image',
        imageUrl:
          'https://images.unsplash.com/photo-1647531041383-fe7103712f16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      },
    },
    {
      id: '3',
      type: 'text',
      contact: {
        name: 'Gareth Garrison',
        imageUrl:
          'https://images.unsplash.com/photo-1615473967657-9dc21773daa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjMwNg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      },
      text: 'elit erat vitae risus. @satoshi Duis a mi fringilla mi lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis',
      owner: false,
      pinned: false,
      mention: true,
      reply: {
        contact: {
          name: 'Leila Joyner',
          imageUrl:
            'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjI0OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        },
        type: 'image-text',
        text: 'lorem, sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec dignissim magna a tortor. Nunc commodo auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium neque. Morbi',
        imageUrl:
          'https://images.unsplash.com/photo-1647531041383-fe7103712f16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      },
    },
    {
      id: '4',
      type: 'image',
      contact: {
        name: 'Celeste Suarez',
        imageUrl: '',
      },
      imageUrl:
        'https://images.unsplash.com/photo-1647531041383-fe7103712f16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      owner: false,
      pinned: false,
      mention: false,
    },
    {
      id: '5',
      type: 'text',
      contact: {
        name: 'Satoshi',
        imageUrl:
          'https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjMwNA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      },
      text: 'tincidunt tempus risus. Donec egestas. Duis ac arcu. Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis mi',
      owner: true,
      pinned: false,
      mention: false,
      reply: {
        contact: {
          name: 'Leila Joyner',
          imageUrl:
            'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjI0OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        },
        type: 'text',
        text: 'tincidunt tempus risus. Donec egestas. Duis ac arcu. Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis mi',
      },
    },
    {
      id: '6',
      type: 'image-text',
      contact: {
        name: 'Leila Joyner',
        imageUrl:
          'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjI0OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      },
      text: 'lorem, sit amet ultricies sem magna nec quam.',
      imageUrl:
        'https://images.unsplash.com/photo-1647531041383-fe7103712f16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      owner: false,
      pinned: false,
      mention: false,
    },
    {
      id: '5',
      type: 'text',
      contact: {
        name: 'Satoshi',
        imageUrl:
          'https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY0OTg0NjMwNA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      },
      text: 'tincidunt tempus risus. Donec egestas. Duis ac arcu. Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis mi',
      owner: true,
      pinned: false,
      mention: false,
    },
  ]
}
