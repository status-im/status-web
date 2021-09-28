export type ChannelData = {
  id: number;
  name: string;
  icon?: string;
  members: number;
  notifications?: number;
};

export const channels = [
  {
    id: 1,
    name: "welcome",
    icon: "https://www.cryptokitties.co/icons/logo.svg",
    members: 7,
  },
  {
    id: 2,
    name: "general",
    members: 15,
  },
  {
    id: 3,
    name: "beginners",
    members: 3,
    notifications: 1,
  },
  {
    id: 4,
    name: "random",
    members: 6,
  },
];
