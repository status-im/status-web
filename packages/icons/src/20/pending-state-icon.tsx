import type { SVGProps } from 'react'

const SvgPendingStateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <circle
      cx={10}
      cy={10}
      r={7}
      stroke="#647084"
      strokeWidth={1.2}
      opacity={0.4}
    />
    <path stroke="#647084" strokeWidth={1.2} d="m13 12-3-1.5V7" />
  </svg>
)
export default SvgPendingStateIcon
