import type { SVGProps } from 'react'

const SvgSwapIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill="currentColor"
      fillRule="evenodd"
      d="m14.781 5-.32.384-2.5 3-.922-.768L13.22 5l-2.18-2.616.922-.768 2.5 3 .32.384Z"
      clipRule="evenodd"
    />
    <mask
      id="prefix__mask0_3221_3539"
      width={11}
      height={2}
      x={3}
      y={4}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint0_linear_3221_3539)"
        d="M3 6h2v11H3z"
        transform="rotate(-90 3 6)"
      />
    </mask>
    <g mask="url(#prefix__mask0_3221_3539)">
      <path stroke="currentColor" strokeWidth={1.2} d="M13.5 5h-10" />
    </g>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m1.219 11 .32-.384 2.5-3 .922.768L2.78 11l2.18 2.616-.922.768-2.5-3-.32-.384Z"
      clipRule="evenodd"
    />
    <mask
      id="prefix__mask1_3221_3539"
      width={11}
      height={2}
      x={2}
      y={10}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint1_linear_3221_3539)"
        d="M13 10h2v11h-2z"
        transform="rotate(90 13 10)"
      />
    </mask>
    <g mask="url(#prefix__mask1_3221_3539)">
      <path stroke="currentColor" strokeWidth={1.2} d="M2.5 11h10" />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_3221_3539"
        x1={4}
        x2={5.823}
        y1={6.458}
        y2={10.083}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
      <linearGradient
        id="prefix__paint1_linear_3221_3539"
        x1={14}
        x2={15.817}
        y1={10.458}
        y2={14.092}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgSwapIcon
