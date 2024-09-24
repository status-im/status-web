import type { SVGProps } from 'react'

const SvgSwapBlurIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <mask
      id="prefix__mask0_8023_72"
      width={16}
      height={9}
      x={1}
      y={9}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path fill="url(#prefix__paint0_linear_8023_72)" d="M17 9v9H1V9h16Z" />
    </mask>
    <g mask="url(#prefix__mask0_8023_72)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m5.822 14.1 2.63 3.005-.904.79-3.5-4-.346-.395.346-.395 3.5-4 .903.79-2.63 3.005H16.5v1.2H5.822Z"
        clipRule="evenodd"
      />
    </g>
    <mask
      id="prefix__mask1_8023_72"
      width={16}
      height={9}
      x={3}
      y={2}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path fill="url(#prefix__paint1_linear_8023_72)" d="M3 11V2h16v9H3Z" />
    </mask>
    <g mask="url(#prefix__mask1_8023_72)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m14.178 5.9-2.63-3.005.903-.79 3.5 4 .346.395-.345.395-3.5 4-.904-.79 2.63-3.005H3.5V5.9h10.678Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_8023_72"
        x1={16.355}
        x2={9.258}
        y1={13.5}
        y2={13.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
      <linearGradient
        id="prefix__paint1_linear_8023_72"
        x1={3.645}
        x2={10.742}
        y1={6.5}
        y2={6.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgSwapBlurIcon
