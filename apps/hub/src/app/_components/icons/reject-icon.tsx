import type { SVGProps } from 'react'

const RejectIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}
  >
    <path
      stroke="#E95460"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="m10.27 10.27 29.46 29.462M25 45.835c11.505 0 20.833-9.328 20.833-20.834S36.505 4.168 24.999 4.168 4.166 13.495 4.166 25.001c0 11.506 9.327 20.834 20.833 20.834Z"
    />
  </svg>
)
export default RejectIcon
