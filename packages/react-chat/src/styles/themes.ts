export type Theme = {
  primary: string;
  secondary: string;
  bodyBackgroundColor: string;
  sectionBackgroundColor: string;
  tertiary: string;
  guestNameColor: string;
  iconColor: string;
  iconUserColor: string;
  iconTextColor: string;
  activeChannelBackground: string;
  notificationColor: string;
  inputColor: string;
  border: string;
  buttonBg: string;
  skeletonLight: string;
  skeletonDark: string;
};

export const lightTheme: Theme = {
  primary: "#000",
  secondary: "#939BA1",
  tertiary: "#4360DF",
  bodyBackgroundColor: "#fff",
  sectionBackgroundColor: "#F6F8FA",
  guestNameColor: "#887AF9",
  iconColor: "#D37EF4",
  iconUserColor: "#717199",
  iconTextColor: "rgba(255, 255, 255, 0.7)",
  activeChannelBackground: "#E9EDF1",
  notificationColor: "#4360DF",
  inputColor: "#EEF2F5",
  border: "#EEF2F5",
  buttonBg: "rgba(67, 96, 223, 0.2)",
  skeletonLight: "#F6F8FA",
  skeletonDark: "#E9EDF1",
};

export const darkTheme: Theme = {
  primary: "#fff",
  secondary: "#909090",
  tertiary: "#88B0FF",
  bodyBackgroundColor: "#000",
  sectionBackgroundColor: "#252525",
  guestNameColor: "#887AF9",
  iconColor: "#D37EF4",
  iconUserColor: "#717199",
  iconTextColor: "rgba(0, 0, 0, 0.7)",
  activeChannelBackground: "#2C2C2C",
  notificationColor: "#887AF9",
  inputColor: "#373737",
  border: "#373737",
  buttonBg: "rgba(134, 158, 255, 0.3)",
  skeletonLight: "#2E2F31",
  skeletonDark: "#141414",
};

export default { lightTheme, darkTheme };
