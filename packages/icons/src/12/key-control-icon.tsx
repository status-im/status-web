import type { SVGProps } from 'react'

const SvgKeyControlIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m6 1.77 4.362 3.816-.724.828L6 3.231 2.362 6.414l-.724-.828L6 1.77Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgKeyControlIcon
