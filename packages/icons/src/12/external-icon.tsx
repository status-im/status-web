import type { SVGProps } from 'react'

const SvgExternalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M9 2.45H5v1.1h2.672L2.611 8.611l.778.778 5.06-5.061V7h1.1V2.45H9Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgExternalIcon
