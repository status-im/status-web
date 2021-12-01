export type Activity = {
  id: string;
  type: "mention" | "request" | "reply";
  isRead?: boolean;
};

export type Activities = {
  [id: string]: Activity;
};
