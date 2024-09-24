import type { SVGProps } from 'react'

const SvgDoneIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M3.6 10a6.4 6.4 0 1 1 12.8 0 6.4 6.4 0 0 1-12.8 0ZM10 2.4a7.6 7.6 0 1 0 0 15.2 7.6 7.6 0 0 0 0-15.2Zm-.277 10.218 3.5-4.5-.947-.736-3.138 4.034L7.61 10.27l-.72.96 2 1.5.471.354.362-.466Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgDoneIcon
