import type { SVGProps } from 'react'

const SvgUnreadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.5 4.4h13v1.2h-13V4.4Zm2 5h9v1.2h-9V9.4Zm7 5h-5v1.2h5v-1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgUnreadIcon
