import type { SVGProps } from 'react'

const SvgCheckCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_417_92)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M8 .9a7.1 7.1 0 1 0 0 14.2A7.1 7.1 0 0 0 8 .9ZM2.1 8a5.9 5.9 0 1 1 11.8 0A5.9 5.9 0 0 1 2.1 8Zm5.324 2.424 4-4-.848-.848L7 9.15 5.424 7.576l-.848.848 2 2 .424.424.424-.424Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_417_92">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgCheckCircleIcon
