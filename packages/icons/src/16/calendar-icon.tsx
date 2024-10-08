import type { SVGProps } from 'react'

const SvgCalendarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.1 2.953V1.5H4.9v1.578a9.66 9.66 0 0 0-.348.059c-.924.175-1.68.47-2.258.972C1.128 5.12.9 6.772.9 8.999c0 2.23.228 3.88 1.394 4.892.579.501 1.334.797 2.258.972.923.175 2.062.237 3.448.237 1.386 0 2.524-.063 3.447-.237.925-.175 1.68-.47 2.258-.972C14.872 12.88 15.1 11.228 15.1 9s-.228-3.88-1.395-4.891c-.578-.501-1.333-.797-2.258-.972a9.648 9.648 0 0 0-.347-.06V1.5H9.9v1.453A29.394 29.394 0 0 0 8 2.9c-.694 0-1.326.016-1.9.053ZM2.26 6.68c.15-.8.413-1.311.82-1.663.359-.311.885-.547 1.695-.7C5.586 4.162 6.636 4.1 8 4.1s2.413.062 3.224.216c.81.153 1.336.389 1.695.7.406.352.67.863.82 1.663l-.154-.023C12.669 6.526 11.012 6.4 8 6.4s-4.67.125-5.585.256l-.154.023Zm-.136 1.244C2.108 8.25 2.1 8.607 2.1 9c0 2.272.272 3.37.98 3.984.36.311.886.547 1.696.7.81.153 1.86.216 3.224.216s2.413-.063 3.224-.216c.81-.153 1.336-.389 1.695-.7.709-.614.98-1.712.98-3.984 0-.393-.007-.75-.024-1.077a7.065 7.065 0 0 0-.46-.079C12.581 7.724 10.988 7.6 8 7.6s-4.581.125-5.415.244a7.069 7.069 0 0 0-.46.08Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgCalendarIcon
