import type { SVGProps } from 'react'

const SvgCheckLargeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path stroke="currentColor" strokeWidth={1.1} d="m1.5 7 3 2.5 6-7" />
  </svg>
)
export default SvgCheckLargeIcon
