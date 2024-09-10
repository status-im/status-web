import type { SVGProps } from 'react'

const SvgHashtagIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M5.903 2.446 5.634 5.4H3v1.2h2.525L5.27 9.4H3v1.2h2.161l-.258 2.846 1.195.108.268-2.954h2.795l-.258 2.846 1.195.108.268-2.954H13V9.4h-2.525l.255-2.8H13V5.4h-2.161l.259-2.846-1.195-.108L9.634 5.4H6.839l.259-2.846-1.195-.108ZM9.27 9.4l.255-2.8H6.73l-.255 2.8H9.27Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgHashtagIcon
