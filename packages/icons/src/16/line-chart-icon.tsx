import type { SVGProps } from 'react'

const SvgLineChartIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.2}
      d="m1 12.5 2-3L4.5 11 6 10l2-3 2 4.5 1.5-4 2 1 1.5-5"
    />
  </svg>
)
export default SvgLineChartIcon
