import type { SVGProps } from 'react'

const SvgRefreshIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M6.615 1.036A7.1 7.1 0 0 1 13.4 3.39V1.5h1.2v4.1h-4.1V4.4h2.174a5.9 5.9 0 1 0-.502 7.772l.848.848A7.1 7.1 0 1 1 6.615 1.036Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgRefreshIcon
