import type { SVGProps } from 'react'

const SvgVerifiedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_101_106)">
      <path
        fill="#23ADA0"
        fillRule="evenodd"
        d="M0 6a2 2 0 0 0 1.396 1.907 2 2 0 0 0 2.697 2.697 2 2 0 0 0 3.814 0 2 2 0 0 0 2.697-2.697 2 2 0 0 0 0-3.814 2 2 0 0 0-2.697-2.697 2 2 0 0 0-3.814 0 2 2 0 0 0-2.697 2.697A2 2 0 0 0 0 6Z"
        clipRule="evenodd"
      />
      <path stroke="#fff" strokeWidth={1.1} d="m3.75 6.25 1.5 1.5 3-3.5" />
    </g>
    <defs>
      <clipPath id="prefix__clip0_101_106">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgVerifiedIcon
