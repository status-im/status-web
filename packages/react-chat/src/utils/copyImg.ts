const createImage = (options: any) => {
  options = options || {};
  const img = document.createElement("img");
  if (options.src) {
    img.src = options.src;
  }
  return img;
};

const copyToClipboard = async (pngBlob: any) => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [pngBlob.type]: pngBlob,
      }),
    ]);
  } catch (error) {
    console.error(error);
  }
};

const convertToPng = (imgBlob: any) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const imageEl = createImage({ src: window.URL.createObjectURL(imgBlob) });
  imageEl.onload = (e: any) => {
    canvas.width = e.target.width;
    canvas.height = e.target.height;
    if (ctx) ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
    canvas.toBlob(copyToClipboard, "image/png", 1);
  };
};

export const copyImg = async (image: string) => {
  const img = await fetch(image);
  const imgBlob = await img.blob();
  const extension = image.split(".").pop();
  const supportedToBeConverted = ["jpeg", "jpg", "gif"];
  if (extension && supportedToBeConverted.indexOf(extension.toLowerCase())) {
    return convertToPng(imgBlob);
  } else if (extension && extension.toLowerCase() === "png") {
    return copyToClipboard(imgBlob);
  }
  return;
};
