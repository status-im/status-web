export type Theme = {
  textPrimaryColor: string;
  textSecondaryColor: string;
  bodyBackgroundColor: string;
  sectionBackgroundColor: string;
  memberNameColor: string;
  guestNameColor: string;
  notificationColor: string;
};

export const lightTheme: Theme = {
  textPrimaryColor: "#000",
  textSecondaryColor: "#939BA1",
  bodyBackgroundColor: "#fff",
  sectionBackgroundColor: "#F6F8FA",
  memberNameColor: "#4360DF",
  guestNameColor: "#887AF9",
  notificationColor: "#4360DF",
};

export const darkTheme: Theme = {
  textPrimaryColor: "#fff",
  textSecondaryColor: "#909090",
  bodyBackgroundColor: "#000",
  sectionBackgroundColor: "#252525",
  memberNameColor: "#88B0FF",
  guestNameColor: "#887AF9",
  notificationColor: "#887AF9",
};

export default { lightTheme, darkTheme };
