import type { SVGProps } from 'react'

const SvgProgressIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g strokeWidth={1.1} clipPath="url(#prefix__clip0_1912_851)">
      <path stroke="#E7EAEE" d="M11 6a5 5 0 1 1-5-5" />
      <path stroke="#09101C" d="M6 1a5 5 0 0 1 5 5" />
    </g>
    <defs>
      <clipPath id="prefix__clip0_1912_851">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgProgressIcon
