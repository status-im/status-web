import { ChannelData } from "./ChannelData";
import { ChatMessage } from "./ChatMessage";
import { CommunityData } from "./CommunityData";

export type Activity = {
  id: string;
  type: "mention" | "request" | "reply" | "invitation";
  isRead?: boolean;
  date: Date;
  user: string;
  message?: ChatMessage;
  channel?: ChannelData;
  request?: string;
  requestType?: "outcome" | "income";
  status?: "sent" | "accepted" | "declined" | "blocked";
  quote?: ChatMessage;
  invitation?: CommunityData;
};

export type Activities = {
  [id: string]: Activity;
};
