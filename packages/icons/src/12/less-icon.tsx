import type { SVGProps } from 'react'

const SvgLessIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M9.5 6.55h-7v-1.1h7v1.1Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgLessIcon
