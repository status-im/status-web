import type { SVGProps } from 'react'

const SvgKeyOptionIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M1.5 2.55h2.619l2.866 7.643.134.357H10.5v-1.1H7.881L5.015 1.807l-.134-.357H1.5v1.1Zm5.5 0h3.5v-1.1H7v1.1Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgKeyOptionIcon
