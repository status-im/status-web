import type { SVGProps } from 'react'

const SvgOnIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      stroke="#09101C"
      strokeWidth={1.1}
      d="m8 1.5-1.5 3H10L4.5 10 5 7H2l2.5-5.5H8Z"
    />
  </svg>
)
export default SvgOnIcon
