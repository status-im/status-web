import type { SVGProps } from 'react'

const SvgShareIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M5.45 2.942 2.362 5.644l-.724-.828 4-3.5L6 .999l.363.317 4 3.5-.725.828L6.55 2.942V8.73h-1.1V2.942Z"
      clipRule="evenodd"
    />
    <path stroke="#09101C" strokeWidth={1.1} d="M2.5 10.5h7" />
  </svg>
)
export default SvgShareIcon
