import type { SVGProps } from 'react'

const SvgConnectionIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M8 .9a7.1 7.1 0 0 0-6.858 5.262l1.16.31a5.9 5.9 0 0 1 11.397 0l1.16-.31A7.1 7.1 0 0 0 8 .9ZM6.6 9.5a1.4 1.4 0 1 1 2.8 0 1.4 1.4 0 0 1-2.8 0ZM8 6.9a2.6 2.6 0 0 0-.6 5.13v2.47h1.2v-2.47A2.601 2.601 0 0 0 8 6.9ZM5.2 4.35a4.6 4.6 0 0 1 7.243 2.46l-1.159.31a3.4 3.4 0 0 0-6.568 0l-1.16-.31A4.6 4.6 0 0 1 5.2 4.35Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgConnectionIcon
