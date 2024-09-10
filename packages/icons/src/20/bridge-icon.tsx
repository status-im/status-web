import type { SVGProps } from 'react'

const SvgBridgeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_7419_55)">
      <mask
        id="prefix__mask0_7419_55"
        width={20}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill="url(#prefix__paint0_linear_7419_55)"
          d="M0 0h20v20H0z"
          transform="matrix(0 -1 -1 0 20 20)"
        />
      </mask>
      <g mask="url(#prefix__mask0_7419_55)">
        <path stroke="#09101C" d="M4.5 10s1-5 5.5-5 5.5 5 5.5 5" />
      </g>
      <circle cx={4.5} cy={12.5} r={2.5} stroke="#09101C" strokeWidth={1.2} />
      <circle cx={15.5} cy={12.5} r={2.5} stroke="#09101C" strokeWidth={1.2} />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_7419_55"
        x1={13}
        x2={15.5}
        y1={4.5}
        y2={8}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
      <clipPath id="prefix__clip0_7419_55">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgBridgeIcon
