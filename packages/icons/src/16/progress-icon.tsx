import type { SVGProps } from 'react'

const SvgProgressIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g strokeWidth={1.2} clipPath="url(#prefix__clip0_2403_847)">
      <circle cx={8} cy={8} r={6.5} stroke="#F0F2F5" />
      <path stroke="currentColor" d="M8 1.5A6.5 6.5 0 0 1 14.5 8" />
    </g>
    <defs>
      <clipPath id="prefix__clip0_2403_847">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgProgressIcon
