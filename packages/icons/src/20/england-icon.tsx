import type { SVGProps } from 'react'

const SvgEnglandIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#EEE"
      d="M17.778 2.778H2.222A2.222 2.222 0 0 0 0 5v10c0 1.227.995 2.222 2.222 2.222h15.556A2.222 2.222 0 0 0 20 15V5a2.222 2.222 0 0 0-2.222-2.222Z"
    />
    <path
      fill="#CE1124"
      d="M11.667 2.778H8.333v5.555H0v3.334h8.333v5.555h3.334v-5.555H20V8.333h-8.333V2.778Z"
    />
  </svg>
)
export default SvgEnglandIcon
