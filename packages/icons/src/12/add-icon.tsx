import type { SVGProps } from 'react'

const SvgAddIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M5.45 6.55V10h1.1V6.55H10v-1.1H6.55V2h-1.1v3.45H2v1.1h3.45Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgAddIcon
