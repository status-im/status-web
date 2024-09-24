import type { SVGProps } from 'react'

const SvgActiveIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_4041_988)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6 .45c-1.996 0-3.464.236-4.389 1.161C.686 2.536.451 4.004.451 6c0 1.996.235 3.464 1.16 4.389.925.925 2.393 1.161 4.39 1.161 1.995 0 3.463-.236 4.388-1.161.925-.925 1.161-2.393 1.161-4.389 0-1.996-.236-3.464-1.16-4.389C9.463.686 7.995.45 6 .45ZM1.55 6c0-2.004.264-3.036.839-3.611C2.964 1.814 3.996 1.55 6 1.55c2.004 0 3.036.264 3.611.839.575.575.84 1.607.84 3.611 0 2.004-.265 3.036-.84 3.611-.575.575-1.607.839-3.61.839-2.005 0-3.037-.264-3.612-.839C1.814 9.036 1.55 8.004 1.55 6Zm6.356.187c0-.75-2.25-2.25-3-2.25s-.75 4.125 0 4.125 3-1.125 3-1.875Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_4041_988">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgActiveIcon
