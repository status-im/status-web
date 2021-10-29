export type ChannelData = {
  id: string;
  name: string;
  type?: "channel" | "dm" | "group";
  description?: string;
  icon?: string;
  isMuted?: boolean;
};
