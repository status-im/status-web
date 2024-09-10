import type { SVGProps } from 'react'

const SvgSendIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m10 4.69.404.366 5.5 5-.807.888-5.096-4.633-5.097 4.633-.807-.888 5.5-5 .404-.367Z"
      clipRule="evenodd"
    />
    <mask
      id="prefix__mask0_347_58"
      width={2}
      height={13}
      x={9}
      y={5}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint0_linear_347_58)"
        d="M11 17.5h2v12h-2z"
        transform="rotate(-180 11 17.5)"
      />
    </mask>
    <g mask="url(#prefix__mask0_347_58)">
      <path stroke="#09101C" strokeWidth={1.2} d="M10 17.5V6" />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_347_58"
        x1={12}
        x2={12}
        y1={18}
        y2={23.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgSendIcon
