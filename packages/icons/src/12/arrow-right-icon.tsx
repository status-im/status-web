import type { SVGProps } from 'react'

const SvgArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M9.288 6.55H1.5v-1.1h7.788L6.586 2.362l.828-.724 3.5 4L11.23 6l-.317.362-3.5 4-.828-.724L9.288 6.55Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrowRightIcon
