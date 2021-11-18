export type Contact = {
  id: string;
  online: boolean;
  trueName: string;
  customName?: string;
  isUntrustworthy: boolean;
  blocked: boolean;
};

export type Contacts = {
  [id: string]: Contact;
};
