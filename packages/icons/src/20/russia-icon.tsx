import type { SVGProps } from 'react'

const SvgRussiaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#CE2028"
      d="M20 15a2.222 2.222 0 0 1-2.222 2.222H2.222A2.222 2.222 0 0 1 0 15v-2.222h20V15Z"
    />
    <path fill="#22408C" d="M0 7.222h20v5.556H0V7.222Z" />
    <path
      fill="#fff"
      d="M17.778 2.778H2.222A2.222 2.222 0 0 0 0 5v2.222h20V5a2.222 2.222 0 0 0-2.222-2.222Z"
    />
  </svg>
)
export default SvgRussiaIcon
