import type { SVGProps } from 'react'

const SvgSwitchIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m13.452 10.895 3.5-4 .346-.395-.346-.395-3.5-4-.903.79 2.63 3.005H4.5v1.2h10.678l-2.63 3.005.904.79Zm-6.903-1.79-3.5 4-.346.395.345.395 3.5 4 .904-.79-2.63-3.005H15.5v-1.2H4.822l2.63-3.005-.903-.79Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgSwitchIcon
