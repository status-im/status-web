import type { SVGProps } from 'react'

const SvgTimeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_6873_81)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M1.55 6a4.45 4.45 0 1 1 8.9 0 4.45 4.45 0 0 1-8.9 0ZM6 .45a5.55 5.55 0 1 0 0 11.1A5.55 5.55 0 0 0 6 .45ZM5.45 3.5v2.775l.22.165 2 1.5.66-.88-1.78-1.335V3.5h-1.1Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_6873_81">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgTimeIcon
