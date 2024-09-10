import type { SVGProps } from 'react'

const SvgBlockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_3221_3659)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M8 .9a7.1 7.1 0 1 0 0 14.2A7.1 7.1 0 0 0 8 .9ZM2.1 8a5.9 5.9 0 0 1 9.626-4.575l-8.3 8.301A5.876 5.876 0 0 1 2.1 8Zm2.174 4.575a5.9 5.9 0 0 0 8.3-8.3l-8.3 8.3Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3221_3659">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgBlockIcon
