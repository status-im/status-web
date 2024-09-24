import type { SVGProps } from 'react'

const SvgChevronRightIcon = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="currentColor"
      strokeWidth={1.2}
      d="M6.25 4.5 9.75 8l-3.5 3.5"
    />
  </svg>
)
export default SvgChevronRightIcon
