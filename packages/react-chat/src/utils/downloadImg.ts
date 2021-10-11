import { createImg } from "./createImg";

const createLink = (name: string, imgBlob: any) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const imageEl = createImg({ src: window.URL.createObjectURL(imgBlob) });
  imageEl.onload = (e: any) => {
    canvas.width = e.target.width;
    canvas.height = e.target.height;
    if (ctx) ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
    const a = document.createElement("a");
    a.download = `${name}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };
};

export const downloadImg = async (image: string) => {
  const img = await fetch(image);
  console.log(img);
  const imgBlob = await img.blob();
  const name = image.split("/").pop();
  if (name) {
    return createLink(name, imgBlob);
  }
  return;
};
