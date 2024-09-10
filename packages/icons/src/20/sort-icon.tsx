import type { SVGProps } from 'react'

const SvgSortIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m14.6 14.696 2.51-2.152.78.912-3.5 3-.39.335-.39-.335-3.5-3 .78-.912 2.51 2.151V4h1.2v10.696ZM2.5 5.4h8v1.2h-8V5.4Zm0 4H9v1.2H2.5V9.4Zm5 4h-5v1.2h5v-1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgSortIcon
