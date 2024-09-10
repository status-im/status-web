import type { SVGProps } from 'react'

const SvgCommandIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M4.1 5.5a1.4 1.4 0 0 1 2.8 0v1.4H5.5a1.4 1.4 0 0 1-1.4-1.4Zm4 0v1.4h3.8V5.5a2.6 2.6 0 1 1 2.6 2.6V6.9a1.4 1.4 0 1 0-1.4-1.4v1.4h1.4v1.2h-1.4v3.8h1.4v1.2h-1.4v1.4h-1.2v-1.4H8.1v1.4H6.9v-1.4H5.5a1.4 1.4 0 1 0 1.4 1.4h1.2a2.6 2.6 0 1 1-2.6-2.6h1.4V8.1H5.5a2.6 2.6 0 1 1 2.6-2.6Zm0 6.4h3.8V8.1H8.1v3.8Zm6.4 1.2a1.4 1.4 0 1 1-1.4 1.4h-1.2a2.6 2.6 0 1 0 2.6-2.6v1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgCommandIcon
