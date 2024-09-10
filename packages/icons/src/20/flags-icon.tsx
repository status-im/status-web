import type { SVGProps } from 'react'

const SvgFlagsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M4.6 3.9V2.5H3.4v15h1.2v-5.9h3.8v1.5h8.2V5.4h-5V3.9h-7Zm0 1.2v5.3h5v1.5h5.8V6.6h-5V5.1H4.6Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgFlagsIcon
