import type { SVGProps } from 'react'

const SvgWebIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="#09101C"
      strokeWidth={1.2}
      d="M10 2.5c6.5 0 7.5 1 7.5 7.5s-1 7.5-7.5 7.5-7.5-1-7.5-7.5 1-7.5 7.5-7.5Z"
    />
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M6.75 5.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9.25 5.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM11.75 5.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgWebIcon
