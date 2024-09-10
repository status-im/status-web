import type { SVGProps } from 'react'

const SvgLoadingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path stroke="#09101C" strokeWidth={1.2} d="M17 10a7 7 0 1 1-7-7" />
    <mask
      id="prefix__mask0_1036_13"
      width={10}
      height={10}
      x={9}
      y={1}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path fill="url(#prefix__paint0_linear_1036_13)" d="M9 1h10v10H9z" />
    </mask>
    <g mask="url(#prefix__mask0_1036_13)">
      <path stroke="#09101C" strokeWidth={1.2} d="M10 3a7 7 0 0 1 7 7" />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_1036_13"
        x1={11}
        x2={15.396}
        y1={3}
        y2={5.909}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgLoadingIcon
