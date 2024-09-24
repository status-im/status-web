import type { SVGProps } from 'react'

const SvgNegativeStateIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <circle
      cx={10}
      cy={10}
      r={7}
      stroke="#E95460"
      strokeWidth={1.2}
      opacity={0.4}
    />
    <path
      fill="#E95460"
      fillRule="evenodd"
      d="m10.75 5.5-.2 6h-1.1l-.2-6h1.5ZM10 13a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgNegativeStateIcon
