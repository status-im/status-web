import { ChannelData } from "./ChannelData";
import { ChatMessage } from "./ChatMessage";

export type Activity = {
  id: string;
  type: "mention" | "request" | "reply";
  isRead?: boolean;
  date: Date;
  user: string;
  message?: ChatMessage;
  channel?: ChannelData;
  request?: string;
  requestType?: "outcome" | "income";
  status?: "sent" | "accepted" | "declined" | "blocked";
  quote?: ChatMessage;
};

export type Activities = {
  [id: string]: Activity;
};
