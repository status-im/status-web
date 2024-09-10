import type { SVGProps } from 'react'

const SvgDragIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M4.5 5.4h11v1.2h-11V5.4Zm0 4h11v1.2h-11V9.4Zm11 4h-11v1.2h11v-1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgDragIcon
