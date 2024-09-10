import type { SVGProps } from 'react'

const SvgFlashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path stroke="#09101C" strokeWidth={1.2} d="M11 8.5v-5l-7 8h5v5l7-8h-5Z" />
  </svg>
)
export default SvgFlashIcon
