import type { SVGProps } from 'react'

const SvgReceiveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="m7.605 13.951-4-3.5.79-.903L8 12.703l3.605-3.155.79.903-4 3.5-.395.346-.395-.346Z"
      clipRule="evenodd"
    />
    <mask
      id="prefix__mask0_3221_3537"
      width={2}
      height={13}
      x={7}
      y={2}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint0_linear_3221_3537)"
        d="M7 2.5h2V15H7V2.5Z"
      />
    </mask>
    <g mask="url(#prefix__mask0_3221_3537)">
      <path stroke="#09101C" strokeWidth={1.2} d="M8 2v11" />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_3221_3537"
        x1={8}
        x2={10.361}
        y1={2.542}
        y2={6.501}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgReceiveIcon
