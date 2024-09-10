import type { SVGProps } from 'react'

const SvgCoverIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="#09101C"
      strokeWidth={1.2}
      d="M2 8c0-4.583.5-5 6-5s6 .417 6 5-.5 5-6 5-6-.417-6-5Z"
    />
  </svg>
)
export default SvgCoverIcon
