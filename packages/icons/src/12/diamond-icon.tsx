import type { SVGProps } from 'react'

const SvgDiamondIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <g clipPath="url(#prefix__clip0_3881_971)">
      <circle cx={6} cy={6} r={6} fill="var(--customisation-50, #2A4AF5)" />
      <path
        stroke="#fff"
        strokeWidth={1.1}
        d="M3.5 6 6 8.5 8.5 6l-1-2h-3l-1 2Z"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3881_971">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgDiamondIcon
