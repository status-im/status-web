const copyToClipboard = async (pngBlob: Blob) => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [pngBlob.type]: pngBlob,
      }),
    ])
  } catch (error) {
    console.error(error)
  }
}

//Images are already converted to png by useMessenger when received
export const copyImg = async (image: string) => {
  const img = await fetch(image)
  const imgBlob = await img.blob()
  return copyToClipboard(imgBlob)
}
