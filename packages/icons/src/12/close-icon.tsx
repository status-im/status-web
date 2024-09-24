import type { SVGProps } from 'react'

const SvgCloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m6 6.778 3.111 3.11.778-.777L6.778 6l3.11-3.111-.777-.778L6 5.222l-3.111-3.11-.778.777L5.222 6l-3.11 3.111.777.778L6 6.778Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgCloseIcon
