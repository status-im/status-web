import type { SVGProps } from 'react'

const SvgTabletIcon = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="currentColor"
      strokeWidth={1.2}
      d="M10 2.5c6 0 6.5.5 6.5 7.5s-.5 7.5-6.5 7.5S3.5 17 3.5 10 4 2.5 10 2.5Z"
    />
  </svg>
)
export default SvgTabletIcon
