import type { SVGProps } from 'react'

const SvgArrowDownIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m10.6 15.144 4.496-4.088.808.888-5.5 5-.404.367-.404-.367-5.5-5 .808-.888L9.4 15.144V4h1.2v11.144Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrowDownIcon
