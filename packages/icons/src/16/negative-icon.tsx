import type { SVGProps } from 'react'

const SvgNegativeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_149_66)" clipRule="evenodd">
      <path
        stroke="#E95460"
        strokeWidth={1.2}
        d="M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z"
        opacity={0.4}
      />
      <path
        fill="#E95460"
        fillRule="evenodd"
        d="m8.6 9.719 2.016-1.68.768.922-3 2.5-.384.32-.384-.32-3-2.5.768-.922L7.4 9.72V4.5h1.2v5.219Z"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_149_66">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgNegativeIcon
