import type { SVGProps } from 'react'

const SvgDropdownIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#E7EAEE"
      fillRule="evenodd"
      d="M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z"
      clipRule="evenodd"
    />
    <path stroke="currentColor" strokeWidth={1.2} d="M5.5 6.5 8 9l2.5-2.5" />
  </svg>
)
export default SvgDropdownIcon
