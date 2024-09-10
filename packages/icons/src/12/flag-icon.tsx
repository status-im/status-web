import type { SVGProps } from 'react'

const SvgFlagIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_3463_955)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M.95.5v11h1.1V8.05h3.4v1.5h5.601v-6.6h-4.5v-1.5H2.05V.5H.95Zm1.1 2.05v4.4h4.5v1.5h3.401v-4.4h-4.5v-1.5H2.05Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3463_955">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgFlagIcon
