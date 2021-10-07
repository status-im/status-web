export function uintToImgUrl(img: Uint8Array) {
  const blob = new Blob([img], { type: "image/png" });
  return URL.createObjectURL(blob);
}
