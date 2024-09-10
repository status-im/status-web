import type { SVGProps } from 'react'

const SvgPendingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <circle cx={2.5} cy={6} r={1} fill="#09101C" opacity={0.4} />
    <circle cx={6} cy={6} r={1} fill="#09101C" opacity={0.3} />
    <circle cx={9.5} cy={6} r={1} fill="#09101C" opacity={0.2} />
  </svg>
)
export default SvgPendingIcon
