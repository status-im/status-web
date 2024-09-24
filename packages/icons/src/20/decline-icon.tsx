import type { SVGProps } from 'react'

const SvgDeclineIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M10 3.6a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8ZM2.4 10a7.6 7.6 0 1 1 15.2 0 7.6 7.6 0 0 1-15.2 0Z"
      clipRule="evenodd"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.2}
      d="m7.525 12.475 4.95-4.95M7.525 7.525l4.95 4.95"
    />
  </svg>
)
export default SvgDeclineIcon
