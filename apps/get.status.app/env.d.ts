declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: import('next/image').StaticImageData
  export default content
}
