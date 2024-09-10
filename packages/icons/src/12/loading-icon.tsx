import type { SVGProps } from 'react'

const SvgLoadingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_1436_281)">
      <path stroke="#09101C" strokeWidth={1.1} d="M11 6a5 5 0 1 1-5-5" />
      <mask
        id="prefix__mask0_1436_281"
        width={6}
        height={6}
        x={6}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path fill="url(#prefix__paint0_linear_1436_281)" d="M6 0h6v6H6V0Z" />
      </mask>
      <g mask="url(#prefix__mask0_1436_281)">
        <path stroke="#09101C" strokeWidth={1.1} d="M6 1a5 5 0 0 1 5 5" />
      </g>
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_1436_281"
        x1={5.6}
        x2={9.117}
        y1={1.6}
        y2={3.928}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
      <clipPath id="prefix__clip0_1436_281">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgLoadingIcon
