import type { SVGProps } from 'react'

const SvgAutomaticIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#A1ABBD"
      fillRule="evenodd"
      d="M8.813 6.433a4 4 0 1 0 0 7.133A5.478 5.478 0 0 1 7.5 10c0-1.36.494-2.606 1.313-3.567Z"
      clipRule="evenodd"
    />
    <circle cx={13} cy={10} r={4} fill="#23ADA0" />
  </svg>
)
export default SvgAutomaticIcon
