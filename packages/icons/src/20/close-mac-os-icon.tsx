import type { SVGProps } from 'react'

const SvgCloseMacOsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <circle cx={10} cy={10} r={6} fill="#E95460" />
    <circle
      cx={10}
      cy={10}
      r={5.4}
      stroke="#1B273D"
      strokeOpacity={0.1}
      strokeWidth={1.2}
    />
  </svg>
)
export default SvgCloseMacOsIcon
