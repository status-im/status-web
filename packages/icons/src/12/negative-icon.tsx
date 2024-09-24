import type { SVGProps } from 'react'

const SvgNegativeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <g clipPath="url(#prefix__clip0_536_27)">
      <circle
        cx={6}
        cy={6}
        r={5}
        stroke="#E95460"
        strokeWidth={1.1}
        opacity={0.4}
      />
      <path
        fill="#E95460"
        fillRule="evenodd"
        d="m6.55 7.172 1.561-1.56.778.777-2.5 2.5L6 9.278l-.389-.39-2.5-2.5.778-.777L5.45 7.172V3h1.1v4.172Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_536_27">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgNegativeIcon
