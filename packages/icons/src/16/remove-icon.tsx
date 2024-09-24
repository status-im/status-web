import type { SVGProps } from 'react'

const SvgRemoveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.5 8.6h-9V7.4h9v1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgRemoveIcon
