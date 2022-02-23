export type Theme = {
  primary: string;
  secondary: string;
  tertiary: string;
  bodyBackgroundColor: string;
  sectionBackgroundColor: string;
  bodyBackgroundGradient: string;
  guestNameColor: string;
  iconColor: string;
  iconUserColor: string;
  iconTextColor: string;
  logoColor: string;
  activeChannelBackground: string;
  notificationColor: string;
  inputColor: string;
  border: string;
  buttonBg: string;
  buttonBgHover: string;
  buttonNoBg: string;
  buttonNoBgHover: string;
  skeletonLight: string;
  skeletonDark: string;
  redColor: string;
  greenColor: string;
  greenBg: string;
  mentionColor: string;
  mentionHover: string;
  mentionBg: string;
  mentionBgHover: string;
  shadow: string;
  reactionBg: string;
  blueBg: string;
};

export const lightTheme: Theme = {
  primary: "#000",
  secondary: "#939BA1",
  tertiary: "#4360DF",
  bodyBackgroundColor: "#fff",
  sectionBackgroundColor: "#F6F8FA",
  bodyBackgroundGradient:
    "linear-gradient(0deg, #FFFFFF 50%, rgba(255, 255, 255, 0) 102.57%)",
  guestNameColor: "#887AF9",
  iconColor: "#D37EF4",
  iconUserColor: "#717199",
  iconTextColor: "rgba(255, 255, 255, 0.7)",
  logoColor: "#51D0F0",
  activeChannelBackground: "#E9EDF1",
  notificationColor: "#4360DF",
  inputColor: "#EEF2F5",
  border: "#EEF2F5",
  buttonBg: "rgba(67, 96, 223, 0.1)",
  buttonBgHover: "rgba(67, 96, 223, 0.2)",
  buttonNoBg: "rgba(255, 45, 85, 0.1)",
  buttonNoBgHover: "rgba(255, 45, 85, 0.2)",
  skeletonLight: "#F6F8FA",
  skeletonDark: "#E9EDF1",
  redColor: "#FF2D55",
  greenColor: "#4EBC60",
  greenBg: "rgba(78, 188, 96, 0.1)",
  mentionColor: "#0DA4C9",
  mentionHover: "#BDE7F2",
  mentionBg: "#E5F8FD",
  mentionBgHover: "#D4F3FA",
  shadow:
    "0px 2px 4px rgba(0, 34, 51, 0.16), 0px 4px 12px rgba(0, 34, 51, 0.08)",
  reactionBg: "#eceffc",
  blueBg: "rgba(67, 96, 223, 0.1)",
};

export const darkTheme: Theme = {
  primary: "#fff",
  secondary: "#909090",
  tertiary: "#88B0FF",
  bodyBackgroundColor: "#000",
  sectionBackgroundColor: "#252525",
  bodyBackgroundGradient:
    "linear-gradient(0deg, #000 50%, rgba(255, 255, 255, 0) 102.57%)",
  guestNameColor: "#887AF9",
  iconColor: "#D37EF4",
  iconUserColor: "#717199",
  logoColor: "#51D0F0",
  iconTextColor: "rgba(0, 0, 0, 0.7)",
  activeChannelBackground: "#2C2C2C",
  notificationColor: "#887AF9",
  inputColor: "#373737",
  border: "#373737",
  buttonBg: "rgba(134, 158, 255, 0.2)",
  buttonBgHover: "rgba(67, 96, 223, 0.3)",
  buttonNoBg: "rgba(255, 92, 123, 0.2)",
  buttonNoBgHover: "rgba(255, 45, 85, 0.3)",
  skeletonLight: "#2E2F31",
  skeletonDark: "#141414",
  redColor: "#FF5C7B",
  greenColor: "#60C370",
  greenBg: "rgba(96, 195, 112, 0.2)",
  mentionColor: "#51D0F0",
  mentionHover: "#004E60",
  mentionBg: "#004050",
  mentionBgHover: "#002D39",
  shadow:
    "0px 2px 4px rgba(0, 34, 51, 0.16), 0px 4px 12px rgba(0, 34, 51, 0.08)",
  reactionBg: "#373737",
  blueBg: "rgba(134, 158, 255, 0.3)",
};

export default { lightTheme, darkTheme };
