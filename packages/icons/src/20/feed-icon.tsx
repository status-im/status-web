import type { SVGProps } from 'react'

const SvgFeedIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M10 3.6a6.4 6.4 0 0 0-5.424 9.8 5.6 5.6 0 1 1 10.848 0A6.4 6.4 0 0 0 10 3.6ZM2.4 10a7.6 7.6 0 1 1 15.2 0 7.6 7.6 0 0 1-15.2 0ZM10 7.6a4.4 4.4 0 0 0-3.55 7 3.6 3.6 0 1 1 7.1 0 4.4 4.4 0 0 0-3.55-7Zm0 8.8a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgFeedIcon
