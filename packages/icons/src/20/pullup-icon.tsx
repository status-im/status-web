import type { SVGProps } from 'react'

const SvgPullupIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#E7EAEE"
      fillRule="evenodd"
      d="M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z"
      clipRule="evenodd"
    />
    <path stroke="currentColor" strokeWidth={1.2} d="m7 11.5 3-3 3 3" />
  </svg>
)
export default SvgPullupIcon
