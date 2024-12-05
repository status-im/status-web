import type { SVGProps } from 'react'

const SvgExternalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M11.551 6.6H7V5.4h6.6V12h-1.2V7.449l-6.476 6.475-.848-.848L11.55 6.6Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgExternalIcon
