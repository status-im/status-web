import type { SVGProps } from 'react'

const SvgKeySpaceIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.55 9.45V7.5h-1.1v3.05h9.1V7.5h-1.1v1.95h-6.9Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgKeySpaceIcon
