import type { SVGProps } from 'react'

const SvgUntrustworthyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#E95460"
      d="m10 2 5.657 2.343L18 10l-2.343 5.657L10 18l-5.657-2.343L2 10l2.343-5.657L10 2Z"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="m10.75 5.5-.2 6h-1.1l-.2-6h1.5ZM10 13a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgUntrustworthyIcon
