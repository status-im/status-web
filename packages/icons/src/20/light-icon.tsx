import type { SVGProps } from 'react'

const SvgLightIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fillRule="evenodd"
      d="M9.4 4V1.5h1.2V4H9.4Zm.6 2.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8ZM5.4 10a4.6 4.6 0 1 1 9.2 0 4.6 4.6 0 0 1-9.2 0Zm4 6v2.5h1.2V16H9.4ZM16 9.4h2.5v1.2H16V9.4Zm-12 0H1.5v1.2H4V9.4Zm10.667 4.418 1.757 1.758-.848.848-1.758-1.757.849-.849ZM6.182 5.333 4.424 3.576l-.848.848 1.757 1.758.849-.849Zm0 9.334-1.758 1.757-.848-.848 1.757-1.758.849.849Zm8.485-8.485 1.757-1.758-.848-.848-1.758 1.757.849.849Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgLightIcon
