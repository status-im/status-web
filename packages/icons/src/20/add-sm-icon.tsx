import type { SVGProps } from 'react'

const SvgAddSmIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.4 10.6V15h1.2v-4.4H15V9.4h-4.4V5H9.4v4.4H5v1.2h4.4Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgAddSmIcon
