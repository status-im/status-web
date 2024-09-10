import type { SVGProps } from 'react'

const SvgExternalIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M11.551 7.6H7V6.4h6.6V13h-1.2V8.449l-6.476 6.475-.848-.848L11.55 7.6Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgExternalIcon
