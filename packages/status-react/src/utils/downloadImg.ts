export const downloadImg = async (image: string) => {
  try {
    const a = document.createElement("a");
    a.download = `${image.split("/").pop()}.png`;
    a.href = image;
    a.click();
  } catch {
    return;
  }
};
