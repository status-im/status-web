export type ChannelData = {
  id: number;
  name: string;
  icon?: string;
  notifications?: number;
  isMuted?: boolean;
  membersList: any[];
};

export const channels = [
  {
    id: 1,
    name: "welcome",
    icon: "https://www.cryptokitties.co/icons/logo.svg",
    membersList: [
      {
        id: 1,
        name: "jason.eth",
        avatar:
          "https://images.unsplash.com/photo-1613329150701-f8cecb3900e0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=928&q=80",
        isOnline: true,
      },
      {
        id: 2,
        name: "viola.stateofus.eth",
        avatar:
          "https://images.unsplash.com/photo-1603924885283-b6674696b114?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
        isOnline: false,
      },
      {
        id: 3,
        name: "GuestFest",
        isOnline: true,
      },
      {
        id: 4,
        name: "Guest33334",
        isOnline: true,
      },
      {
        id: 5,
        name: "Guest333",
        isOnline: true,
      },
      {
        id: 6,
        name: "Guest33",
        isOnline: false,
      },
      {
        id: 7,
        name: "Guest9283",
        isOnline: true,
      },
    ],
  },
  {
    id: 2,
    name: "general",
    membersList: [
      {
        id: 1,
        name: "jason.eth",
        avatar:
          "https://images.unsplash.com/photo-1613329150701-f8cecb3900e0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=928&q=80",
        isOnline: true,
      },
      {
        id: 2,
        name: "viola.stateofus.eth",
        avatar:
          "https://images.unsplash.com/photo-1603924885283-b6674696b114?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
        isOnline: false,
      },
      {
        id: 3,
        name: "Guest",
        isOnline: true,
      },
    ],
  },
  {
    id: 3,
    name: "beginners",
    notifications: 1,
    membersList: [
      {
        id: 1,
        name: "jason.eth",
        avatar:
          "https://images.unsplash.com/photo-1613329150701-f8cecb3900e0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=928&q=80",
        isOnline: true,
      },
      {
        id: 2,
        name: "viola.stateofus.eth",
        avatar:
          "https://images.unsplash.com/photo-1603924885283-b6674696b114?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
        isOnline: false,
      },
      {
        id: 3,
        name: "Guest",
        isOnline: true,
      },
    ],
  },
  {
    id: 4,
    name: "random",
    isMuted: true,
    membersList: [
      {
        id: 14,
        name: "jason",
        isOnline: true,
      },
      {
        id: 16,
        name: "jonh",
        isOnline: false,
      },
      {
        id: 3,
        name: "Guest",
        isOnline: true,
      },
    ],
  },
];
