import type { SVGProps } from 'react'

const SvgNeutralIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <circle cx={10} cy={10} r={7.5} fill="#647084" />
    <path stroke="#fff" strokeWidth={1.2} d="M7 10h6" />
  </svg>
)
export default SvgNeutralIcon
