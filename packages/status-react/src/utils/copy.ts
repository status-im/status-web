export const copy = (text: string) => {
  navigator.clipboard.writeText(text).catch((error) => {
    console.log(error);
  });
};
