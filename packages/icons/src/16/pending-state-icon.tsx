import type { SVGProps } from 'react'

const SvgPendingStateIcon = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="#647084"
      strokeWidth={1.2}
      d="M1.6 8a6.4 6.4 0 1 1 12.8 0A6.4 6.4 0 0 1 1.6 8Z"
      opacity={0.4}
    />
    <path stroke="#647084" strokeWidth={1.2} d="M11 10 8 8V5" />
  </svg>
)
export default SvgPendingStateIcon
