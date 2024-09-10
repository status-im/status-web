import type { SVGProps } from 'react'

const SvgArrowTopIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M10.404 3.056 10 2.69l-.404.367-5.5 5 .808.888L9.4 4.856V16h1.2V4.856l4.496 4.088.808-.888-5.5-5Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrowTopIcon
