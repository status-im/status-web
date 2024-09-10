import type { SVGProps } from 'react'

const SvgActiveMembersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="#09101C"
      strokeWidth={1.2}
      d="M11 2.5H6l-4 7h4l-1 4L14 6H9l2-3.5Z"
    />
  </svg>
)
export default SvgActiveMembersIcon
