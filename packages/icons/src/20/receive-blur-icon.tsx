import type { SVGProps } from 'react'

const SvgReceiveBlurIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <mask
      id="prefix__mask0_7508_128"
      width={14}
      height={17}
      x={3}
      y={2}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint0_linear_7508_128)"
        d="M0 0h13v17H0z"
        transform="matrix(-1 0 0 1 16.5 2)"
      />
    </mask>
    <g mask="url(#prefix__mask0_7508_128)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M9.4 13.147 4.904 9.06l-.807.888 5.5 5 .404.367.403-.367 5.5-5-.807-.888-4.497 4.088V2.5H9.4v10.647Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_7508_128"
        x1={6.5}
        x2={6.5}
        y1={0.708}
        y2={8.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgReceiveBlurIcon
