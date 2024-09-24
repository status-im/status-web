import type { SVGProps } from 'react'

const SvgChevronTopIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path stroke="currentColor" strokeWidth={1.2} d="M4.5 10 8 6.5l3.5 3.5" />
  </svg>
)
export default SvgChevronTopIcon
