import type { SVGProps } from 'react'

const SvgActiveMembersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={13}
    fill="none"
    viewBox="0 0 12 13"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={1.1}
      d="m8 1.5-1.5 3H10l-5.5 6L5 7H2l2.5-5.5H8Z"
    />
  </svg>
)
export default SvgActiveMembersIcon
