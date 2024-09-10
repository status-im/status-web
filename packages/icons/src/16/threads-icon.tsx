import type { SVGProps } from 'react'

const SvgThreadsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="#09101C"
      strokeWidth={1.1}
      d="M1.5 6.5c0-1.398 0-2.097.228-2.648a3 3 0 0 1 1.624-1.624C3.903 2 4.602 2 6 2h4.75a2.25 2.25 0 0 1 0 4.5H1.5ZM14.5 14c0-1.398 0-2.097-.228-2.648a3 3 0 0 0-1.624-1.624C12.097 9.5 11.398 9.5 10 9.5H5.25a2.25 2.25 0 0 0 0 4.5h9.25Z"
    />
  </svg>
)
export default SvgThreadsIcon
