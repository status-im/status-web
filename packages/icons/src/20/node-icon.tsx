import type { SVGProps } from 'react'

const SvgNodeIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M5 2.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8ZM1.4 5a3.6 3.6 0 1 1 6.534 2.086l1.553 1.553a5.6 5.6 0 1 1-.849.849L7.087 7.933A3.6 3.6 0 0 1 1.4 5Zm7.2 8a4.4 4.4 0 1 1 8.8 0 4.4 4.4 0 0 1-8.8 0Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgNodeIcon
