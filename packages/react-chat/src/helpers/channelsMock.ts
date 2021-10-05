export type ChannelData = {
  id: number;
  name: string;
  description: string;
  icon?: string;
  notifications?: number;
  isMuted?: boolean;
};

export const channels = [
  {
    id: 1,
    name: "welcome",
    description: "Welcome to CryptoKitties community!",
    icon: "https://www.cryptokitties.co/icons/logo.svg",
  },
  {
    id: 2,
    name: "general",
    description: "General discussions about CryptoKitties",
  },
  {
    id: 3,
    name: "beginners",
    description: "How to start",
    notifications: 1,
  },
  {
    id: 4,
    name: "random",
    description: "Whatever you want to talk",
    isMuted: true,
  },
];
