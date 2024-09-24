import type { SVGProps } from 'react'

const SvgPlaceholderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <g clipPath="url(#prefix__clip0_101_111)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M.9 8a7.1 7.1 0 1 1 14.2 0A7.1 7.1 0 0 1 .9 8ZM8 2.1c-1.413 0-2.71.497-3.726 1.325L8 7.151l3.726-3.726A5.875 5.875 0 0 0 8 2.1Zm4.575 2.174L8.849 8l3.726 3.726A5.875 5.875 0 0 0 13.9 8c0-1.413-.497-2.71-1.325-3.726ZM7.152 8 3.425 4.274A5.876 5.876 0 0 0 2.1 8c0 1.413.497 2.71 1.325 3.726L7.152 8Zm-2.878 4.575L8 8.848l3.726 3.727A5.876 5.876 0 0 1 8 13.9a5.876 5.876 0 0 1-3.726-1.325Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_101_111">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgPlaceholderIcon
