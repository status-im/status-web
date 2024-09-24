import type { SVGProps } from 'react'

const SvgMutualContactIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill="var(--customisation-50, #2A4AF5)"
      fillOpacity={0.4}
      fillRule="evenodd"
      d="M8.958 5.723a5.5 5.5 0 1 0 0 8.554A6.97 6.97 0 0 1 7.5 10a6.97 6.97 0 0 1 1.458-4.277Z"
      clipRule="evenodd"
    />
    <circle cx={14.5} cy={10} r={5.5} fill="var(--customisation-50, #2A4AF5)" />
  </svg>
)
export default SvgMutualContactIcon
