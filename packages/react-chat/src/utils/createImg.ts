export const createImg = (options: any) => {
  options = options || {};
  const img = document.createElement("img");
  if (options.src) {
    img.src = options.src;
  }
  return img;
};
