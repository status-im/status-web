import type { SVGProps } from 'react'

const SvgArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M11.752 8.6H3V7.4h8.752l-3.22-4.025.937-.75 4 5 .3.375-.3.375-4 5-.938-.75 3.22-4.025Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrowRightIcon
