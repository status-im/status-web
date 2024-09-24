import type { SVGProps } from 'react'

const SvgSendIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m8 1.703.395.345 4 3.5-.79.903L8 3.297 4.395 6.451l-.79-.903 4-3.5L8 1.703Z"
      clipRule="evenodd"
    />
    <mask
      id="prefix__mask0_3221_3538"
      width={2}
      height={12}
      x={7}
      y={2}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="url(#prefix__paint0_linear_3221_3538)"
        d="M9 13.5H7V2h2v11.5Z"
      />
    </mask>
    <g mask="url(#prefix__mask0_3221_3538)">
      <path stroke="currentColor" strokeWidth={1.2} d="M8 3v11" />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_3221_3538"
        x1={8}
        x2={6.183}
        y1={12.542}
        y2={8.908}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgSendIcon
