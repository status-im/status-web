import type { SVGProps } from 'react'

const SvgSwapIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m12.452 10.895 3.5-4 .346-.395-.346-.395-3.5-4-.903.79L14.703 6.5l-3.154 3.605.903.79Zm-4.903-1.79-3.5 4-.346.395.345.395 3.5 4 .904-.79L5.297 13.5l3.155-3.605-.903-.79Z"
      clipRule="evenodd"
    />
    <mask
      id="prefix__mask0_8023_48"
      width={12}
      height={3}
      x={3}
      y={5}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint0_linear_8023_48)"
        d="M3 7.5h2v12H3z"
        transform="rotate(-90 3 7.5)"
      />
    </mask>
    <g mask="url(#prefix__mask0_8023_48)">
      <path stroke="currentColor" strokeWidth={1.2} d="M3.5 6.5H15" />
    </g>
    <mask
      id="prefix__mask1_8023_48"
      width={12}
      height={3}
      x={5}
      y={12}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint1_linear_8023_48)"
        d="M17 12.5h2v12h-2z"
        transform="rotate(90 17 12.5)"
      />
    </mask>
    <g mask="url(#prefix__mask1_8023_48)">
      <path stroke="currentColor" strokeWidth={1.2} d="M16.5 13.5H5" />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_8023_48"
        x1={4}
        x2={4}
        y1={8}
        y2={13.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
      <linearGradient
        id="prefix__paint1_linear_8023_48"
        x1={18}
        x2={18}
        y1={13}
        y2={18.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgSwapIcon
