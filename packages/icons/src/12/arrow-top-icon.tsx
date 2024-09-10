import type { SVGProps } from 'react'

const SvgArrowTopIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M6.362 1.086 6 .77l-.362.317-4 3.5.724.828L5.45 2.712V10.5h1.1V2.712l3.088 2.702.724-.828-4-3.5Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrowTopIcon
