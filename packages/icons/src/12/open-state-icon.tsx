import type { SVGProps } from 'react'

const SvgOpenStateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_3456_968)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M10.9 6a4.9 4.9 0 1 1-9.8 0 4.9 4.9 0 0 1 9.8 0ZM12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0ZM6 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3456_968">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgOpenStateIcon
