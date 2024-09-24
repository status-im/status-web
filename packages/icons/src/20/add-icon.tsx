import type { SVGProps } from 'react'

const SvgAddIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.4 10.6v5.9h1.2v-5.9h5.9V9.4h-5.9V3.5H9.4v5.9H3.5v1.2h5.9Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgAddIcon
