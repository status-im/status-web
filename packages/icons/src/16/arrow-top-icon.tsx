import type { SVGProps } from 'react'

const SvgArrowTopIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M8.375 2.532 8 2.232l-.375.3-5 4 .75.937L7.4 4.249V13h1.2V4.248l4.025 3.22.75-.936-5-4Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrowTopIcon
