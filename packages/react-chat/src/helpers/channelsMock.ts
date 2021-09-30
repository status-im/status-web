export type ChannelData = {
  id: number;
  name: string;
  icon?: string;
  members: number;
  notifications?: number;
  isMuted?: boolean;
  membersList?: any[];
};

export const channels = [
  {
    id: 1,
    name: 'welcome',
    icon: 'https://www.cryptokitties.co/icons/logo.svg',
    members: 7,
    membersList: [
      {
        id: 1,
        name: 'jason.eth',
        avatar: 'https://unsplash.com/photos/kOuoJJt5YRU',
        isOnline: true,
      },
      {
        id: 2,
        name: 'viola.stateofus.eth',
        avatar: 'https://unsplash.com/photos/1KXHKaaJylM',
        isOnline: false,
      },
      {
        id: 3,
        name: 'Guest',
        isOnline: true,
      },
    ],
  },
  {
    id: 2,
    name: 'general',
    members: 15,
  },
  {
    id: 3,
    name: 'beginners',
    members: 3,
    notifications: 1,
  },
  {
    id: 4,
    name: 'random',
    members: 6,
    isMuted: true,
  },
];
