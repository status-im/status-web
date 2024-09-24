import type { SVGProps } from 'react'

const SvgIntermediateCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <circle
      cx={10}
      cy={10}
      r={7.5}
      stroke="#23ADA0"
      strokeWidth={1.2}
      opacity={0.4}
    />
    <path stroke="#23ADA0" strokeWidth={1.2} d="m7.25 10.75 2 1.5 3.5-4.5" />
  </svg>
)
export default SvgIntermediateCircleIcon
