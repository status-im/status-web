import type { SVGProps } from 'react'

const SvgArrowDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m8.6 11.752 4.025-3.22.75.937-5 4-.375.3-.375-.3-5-4 .75-.938 4.025 3.22V3h1.2v8.752Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrowDownIcon
