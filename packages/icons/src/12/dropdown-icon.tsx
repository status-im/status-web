import type { SVGProps } from 'react'

const SvgDropdownIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_101_109)">
      <circle cx={6} cy={6} r={6} fill="#E7EAEE" />
      <path stroke="currentColor" strokeWidth={1.1} d="M3.5 5 6 7.5 8.5 5" />
    </g>
    <defs>
      <clipPath id="prefix__clip0_101_109">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgDropdownIcon
