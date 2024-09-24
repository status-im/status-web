import type { SVGProps } from 'react'

const SvgUndoIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_6516_71)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.597 1.777a4.45 4.45 0 1 1-1.743 7.37l-.778.777a5.55 5.55 0 1 0-.026-7.822V.5H.95v3.55H4.5v-1.1H2.76a4.45 4.45 0 0 1 1.837-1.173ZM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_6516_71">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgUndoIcon
