import type { SVGProps } from 'react'

const SvgMentionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_1945_856)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M9.838 1.142a7.1 7.1 0 1 0 1.712 13.007l-.6-1.04A5.9 5.9 0 1 1 13.9 8v.75a1.15 1.15 0 0 1-2.3 0V5h-1.2v.318a3.6 3.6 0 1 0 .475 4.85A2.35 2.35 0 0 0 15.1 8.75V8a7.1 7.1 0 0 0-5.262-6.858ZM8 5.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_1945_856">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgMentionIcon
