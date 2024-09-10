import type { SVGProps } from 'react'

const SvgBulletIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M6.5 10c0-2.5 1-3.5 3.5-3.5s3.5 1 3.5 3.5-1 3.5-3.5 3.5-3.5-1-3.5-3.5Z"
    />
  </svg>
)
export default SvgBulletIcon
