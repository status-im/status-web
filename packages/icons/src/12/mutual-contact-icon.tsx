import type { SVGProps } from 'react'

const SvgMutualContactIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      fill="#2A4AF5"
      fillRule="evenodd"
      d="M4.726 3.22a3.5 3.5 0 1 0 0 6.559A4.98 4.98 0 0 1 3.5 6.5a4.98 4.98 0 0 1 1.226-3.28Z"
      clipRule="evenodd"
      opacity={0.4}
    />
    <circle cx={8.5} cy={6.5} r={3.5} fill="#2A4AF5" />
  </svg>
)
export default SvgMutualContactIcon
