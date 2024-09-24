import type { SVGProps } from 'react'

const SvgArrowDownIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m6.55 9.288 3.088-2.702.724.828-4 3.5L6 11.23l-.362-.317-4-3.5.724-.828L5.45 9.288V1.5h1.1v7.788Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrowDownIcon
