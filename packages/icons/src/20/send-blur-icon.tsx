import type { SVGProps } from 'react'

const SvgSendBlurIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <mask
      id="prefix__mask0_7508_129"
      width={14}
      height={17}
      x={3}
      y={1}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint0_linear_7508_129)"
        d="M16.5 18h13v17h-13z"
        transform="rotate(-180 16.5 18)"
      />
    </mask>
    <g mask="url(#prefix__mask0_7508_129)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="m9.4 6.857-4.496 4.087-.807-.888 5.5-5 .404-.367.403.367 5.5 5-.807.888L10.6 6.856V17.5H9.4V6.857Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_7508_129"
        x1={23}
        x2={23}
        y1={18.708}
        y2={26.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgSendBlurIcon
