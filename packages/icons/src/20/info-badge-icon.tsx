import type { SVGProps } from 'react'

const SvgInfoBadgeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm-.55-8.5-.2 6h1.5l-.2-6h-1.1Zm-.2-2.25a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgInfoBadgeIcon
