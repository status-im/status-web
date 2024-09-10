import type { SVGProps } from 'react'

const SvgCloseCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm-2.924 8.576L7.15 8 5.076 5.924l.848-.848L8 7.15l2.076-2.075.848.848L8.85 8l2.075 2.076-.848.848L8 8.85l-2.076 2.075-.848-.848Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgCloseCircleIcon
