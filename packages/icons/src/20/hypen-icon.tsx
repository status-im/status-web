import type { SVGProps } from 'react'

const SvgHypenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path stroke="currentColor" strokeWidth={1.2} d="M6 10h8" />
  </svg>
)
export default SvgHypenIcon
