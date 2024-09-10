import type { SVGProps } from 'react'

const SvgActiveMembersIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M13.5 3.5H7l-3.5 8h5l-1.5 5 9.5-9H11l2.5-4Z"
    />
  </svg>
)
export default SvgActiveMembersIcon
