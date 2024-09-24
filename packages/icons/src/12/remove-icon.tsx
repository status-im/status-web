import type { SVGProps } from 'react'

const SvgRemoveIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_1073_30)">
      <circle cx={6} cy={6} r={6} fill="#647084" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m6 6.778 1.861 1.86.778-.777L6.778 6l1.86-1.861-.777-.778L6 5.222l-1.861-1.86-.778.777L5.222 6l-1.86 1.861.777.778L6 6.778Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_1073_30">
        <rect width={12} height={12} fill="#fff" rx={6} />
      </clipPath>
    </defs>
  </svg>
)
export default SvgRemoveIcon
