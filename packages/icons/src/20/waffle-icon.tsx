import type { SVGProps } from 'react'

const SvgWaffleIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M7.75 6.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm4.5 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 10a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 9 10Zm3.25 1.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 14.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM12.25 16a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgWaffleIcon
