import type { SVGProps } from 'react'

const SvgPlayMediaIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M7.193 16c-1.807 0-1.808-12 0-12C9 4 16.5 8.5 16.5 10S9 16 7.193 16Z"
    />
  </svg>
)
export default SvgPlayMediaIcon
