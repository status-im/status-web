import type { SVGProps } from 'react'

const SvgHistoryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M5.07 1.533A7.1 7.1 0 1 1 2.98 13.02l.848-.848A5.9 5.9 0 1 0 3.325 4.4H5.5v1.2H1.4V1.5h1.2v1.89a7.1 7.1 0 0 1 2.47-1.857ZM8.6 5v2.66l2.209 1.326-.618 1.029-2.5-1.5L7.4 8.34V5h1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgHistoryIcon
