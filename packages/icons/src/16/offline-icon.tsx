import type { SVGProps } from 'react'

const SvgOfflineIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <circle cx={8} cy={8} r={4} fill="#A1ABBD" />
  </svg>
)
export default SvgOfflineIcon
