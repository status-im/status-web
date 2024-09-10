import type { SVGProps } from 'react'

const SvgAddCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_691_20)">
      <circle cx={6} cy={6} r={6} fill="#647084" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M5.45 6.55V9h1.1V6.55H9v-1.1H6.55V3h-1.1v2.45H3v1.1h2.45Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_691_20">
        <rect width={12} height={12} fill="#fff" rx={6} />
      </clipPath>
    </defs>
  </svg>
)
export default SvgAddCircleIcon
