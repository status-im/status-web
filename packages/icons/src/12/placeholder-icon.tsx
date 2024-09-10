import type { SVGProps } from 'react'

const SvgPlaceholderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_109_44)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M6 1.55c-1.03 0-1.98.35-2.734.938L6 5.222l2.734-2.734A4.43 4.43 0 0 0 6 1.55Zm3.511 1.716L6.778 6 9.51 8.734A4.43 4.43 0 0 0 10.45 6c0-1.03-.35-1.98-.939-2.734ZM5.222 6 2.488 3.266A4.43 4.43 0 0 0 1.55 6c0 1.03.35 1.98.938 2.734L5.222 6ZM3.266 9.51 6 6.778l2.734 2.734A4.43 4.43 0 0 1 6 10.45a4.43 4.43 0 0 1-2.734-.939ZM.45 6a5.55 5.55 0 1 1 11.1 0A5.55 5.55 0 0 1 .45 6Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_109_44">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgPlaceholderIcon
