import type { SVGProps } from 'react'

const SvgMentionIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_1945_871)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3.876.872A5.55 5.55 0 0 1 11.55 6v.5a2.05 2.05 0 0 1-3.684 1.238 2.55 2.55 0 1 1-.416-3.836V3.5h1.1v3a.95.95 0 0 0 1.9 0V6a4.45 4.45 0 1 0-2.225 3.854l.55.952A5.55 5.55 0 1 1 3.876.872ZM7.45 6a1.45 1.45 0 1 0-2.9 0 1.45 1.45 0 0 0 2.9 0Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_1945_871">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgMentionIcon
