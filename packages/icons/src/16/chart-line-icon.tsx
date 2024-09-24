import type { SVGProps } from 'react'

const SvgChartLineIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path
      stroke="#23ADA0"
      strokeWidth={1.2}
      d="m1 11.5 2-1 1.5.5L6 9l2-1 2 2.5 1.5-3h2L15 4"
    />
  </svg>
)
export default SvgChartLineIcon
