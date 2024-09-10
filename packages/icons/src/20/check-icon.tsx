import type { SVGProps } from 'react'

const SvgCheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path stroke="#09101C" strokeWidth={1.2} d="m4.5 11 4 3.5 7-9.5" />
  </svg>
)
export default SvgCheckIcon
