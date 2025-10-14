import type { SVGProps } from 'react'

const RejectIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}
  >
    <g
      stroke="#E95460"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      clipPath="url(#a)"
    >
      <path d="m10.269 10.27 29.46 29.462M25 45.833c11.506 0 20.834-9.328 20.834-20.834S36.506 4.166 25 4.166 4.167 13.493 4.167 24.999c0 11.506 9.327 20.834 20.833 20.834Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h50v50H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default RejectIcon
