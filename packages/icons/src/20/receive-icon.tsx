import type { SVGProps } from 'react'

const SvgReceiveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="m9.597 14.948-5.5-5 .807-.888 5.097 4.633 5.096-4.633.807.888-5.5 5-.403.367-.404-.367Z"
      clipRule="evenodd"
    />
    <mask
      id="prefix__mask0_347_48"
      width={2}
      height={13}
      x={9}
      y={2}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint0_linear_347_48)"
        d="M0 0h2v12H0z"
        transform="matrix(-1 0 0 1 11 2.5)"
      />
    </mask>
    <g mask="url(#prefix__mask0_347_48)">
      <path stroke="#09101C" strokeWidth={1.2} d="M10 2.5V14" />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_347_48"
        x1={1}
        x2={1}
        y1={0.5}
        y2={6}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgReceiveIcon
