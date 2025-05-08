export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          const base64String = (reader.result as string).split(',')[1]
          resolve(base64String)
        } else {
          reject('Error reading file')
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    } else {
      reject('No file selected')
    }
  })
}
