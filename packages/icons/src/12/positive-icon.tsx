import type { SVGProps } from 'react'

const SvgPositiveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_536_28)">
      <circle
        cx={6}
        cy={6}
        r={5}
        stroke="#23ADA0"
        strokeWidth={1.1}
        opacity={0.4}
      />
      <path
        fill="#23ADA0"
        fillRule="evenodd"
        d="M6.389 3.111 6 2.722l-.389.39-2.5 2.5.778.777L5.45 4.828V9h1.1V4.828l1.561 1.56.778-.777-2.5-2.5Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_536_28">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgPositiveIcon
