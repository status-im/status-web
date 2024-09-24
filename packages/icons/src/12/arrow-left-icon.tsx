import type { SVGProps } from 'react'

const SvgArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m4.586 1.638-3.5 4L.769 6l.317.362 3.5 4 .828-.724L2.712 6.55H10.5v-1.1H2.712l2.702-3.088-.828-.724Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrowLeftIcon
