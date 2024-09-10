import type { SVGProps } from 'react'

const SvgTimeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_6873_70)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M8 .9a7.1 7.1 0 1 0 0 14.2A7.1 7.1 0 0 0 8 .9ZM2.1 8a5.9 5.9 0 1 1 11.8 0A5.9 5.9 0 0 1 2.1 8Zm5.3-3v3.34l.291.174 2.5 1.5.618-1.029-2.21-1.325V5H7.4Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_6873_70">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgTimeIcon
