import type { SVGProps } from 'react'

const SvgMenuIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M3.5 4.4h13v1.2h-13V4.4Zm0 5h13v1.2h-13V9.4Zm13 5h-13v1.2h13v-1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgMenuIcon
