import type { SVGProps } from 'react'

const SvgInfoGreyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_1592_839)">
      <path
        fill="#647084"
        fillRule="evenodd"
        d="M6 11.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm.55-6.25.2 4h-1.5l.2-4h1.1ZM5.38 3.625a.625.625 0 1 0 1.25 0 .625.625 0 0 0-1.25 0Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_1592_839">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgInfoGreyIcon
