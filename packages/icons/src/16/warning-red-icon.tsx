import type { SVGProps } from 'react'

const SvgWarningRedIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#E95460"
      fillRule="evenodd"
      d="M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z"
      clipRule="evenodd"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="m8.75 4-.2 5h-1.1l-.2-5h1.5ZM8 10.5A.75.75 0 1 1 8 12a.75.75 0 0 1 0-1.5Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgWarningRedIcon
