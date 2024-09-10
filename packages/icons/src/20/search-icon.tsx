import type { SVGProps } from 'react'

const SvgSearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M3.1 9a5.9 5.9 0 1 1 11.8 0A5.9 5.9 0 0 1 3.1 9ZM9 1.9a7.1 7.1 0 1 0 4.578 12.527l3.498 3.497.848-.848-3.497-3.498A7.1 7.1 0 0 0 9 1.9Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgSearchIcon
