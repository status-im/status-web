import type { SVGProps } from 'react'

const SvgSentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path stroke="#09101C" strokeWidth={1.1} d="M2 6.5 5 9l5-6" />
  </svg>
)
export default SvgSentIcon
