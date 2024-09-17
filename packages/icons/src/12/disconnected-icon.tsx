import type { SVGProps } from 'react'

const SvgDisconnectedIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_7414_59)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.278 1.722a3.05 3.05 0 0 0-4.313 0L4.727 2.959l.778.778L6.743 2.5A1.95 1.95 0 0 1 9.5 5.257L8.263 6.495l.778.778 1.237-1.238a3.05 3.05 0 0 0 0-4.313ZM2.96 4.727 1.722 5.964a3.05 3.05 0 1 0 4.314 4.314L7.273 9.04l-.778-.777L5.258 9.5A1.95 1.95 0 0 1 2.5 6.742l1.238-1.237-.778-.778ZM2.5 1.722l-.778.778L9.5 10.278l.778-.778L2.5 1.722Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_7414_59">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgDisconnectedIcon