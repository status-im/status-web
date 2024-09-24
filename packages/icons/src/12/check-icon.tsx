import type { SVGProps } from 'react'

const SvgCheckIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_417_74)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1.55 6a4.45 4.45 0 1 1 8.9 0 4.45 4.45 0 0 1-8.9 0ZM6 .45a5.55 5.55 0 1 0 0 11.1A5.55 5.55 0 0 0 6 .45Zm-.332 7.658 3-3.5-.836-.716-2.613 3.05-1.08-1.081-.778.778 1.5 1.5.42.42.387-.451Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_417_74">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgCheckIcon
