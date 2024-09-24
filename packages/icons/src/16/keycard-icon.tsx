import type { SVGProps } from 'react'

const SvgKeycardIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M2.5 8C2.5 2 3 1.5 8 1.5s5.5.5 5.5 6.5-.5 6.5-5.5 6.5S2.5 14 2.5 8Z"
    />
    <circle cx={7.5} cy={5} r={1.5} stroke="currentColor" strokeWidth={1.2} />
    <path stroke="currentColor" strokeWidth={1.2} d="M7.5 6.5v6" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M7.5 10.6h.679l1.267 1.9h1.442L8.999 9.667 8.821 9.4H7.5v1.2Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m9.332 8-1.12 1.4H7.5v1.2h1.288l.18-.225L10.869 8H9.332Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgKeycardIcon
