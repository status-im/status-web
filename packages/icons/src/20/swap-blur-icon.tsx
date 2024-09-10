import type { SVGProps } from 'react'

const SvgSwapBlurIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <mask
      id="prefix__mask0_7508_130"
      width={9}
      height={16}
      x={9}
      y={3}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path fill="url(#prefix__paint0_linear_7508_130)" d="M9 3h9v16H9V3Z" />
    </mask>
    <g mask="url(#prefix__mask0_7508_130)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="m14.1 14.178 3.005-2.63.79.904-4 3.5-.395.346-.395-.346-4-3.5.79-.903 3.005 2.63V3.5h1.2v10.678Z"
        clipRule="evenodd"
      />
    </g>
    <mask
      id="prefix__mask1_7508_130"
      width={9}
      height={16}
      x={2}
      y={1}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path fill="url(#prefix__paint1_linear_7508_130)" d="M11 17H2V1h9v16Z" />
    </mask>
    <g mask="url(#prefix__mask1_7508_130)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="m5.9 5.822-3.005 2.63-.79-.903 4-3.5.395-.346.395.345 4 3.5-.79.904L7.1 5.822V16.5H5.9V5.822Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_7508_130"
        x1={13.5}
        x2={13.5}
        y1={3.645}
        y2={10.742}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
      <linearGradient
        id="prefix__paint1_linear_7508_130"
        x1={6.5}
        x2={6.5}
        y1={16.355}
        y2={9.258}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgSwapBlurIcon
