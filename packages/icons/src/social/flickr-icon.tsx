import type { SVGProps } from 'react'

const SvgFlickrIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15.5 14.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM4.5 14.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
    />
  </svg>
)
export default SvgFlickrIcon
