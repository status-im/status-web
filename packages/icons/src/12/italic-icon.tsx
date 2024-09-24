import type { SVGProps } from 'react'

const SvgItalicIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.886 2.05H3.5V.95h6v1.1H6.992l-.878 7.9H8.5v1.1h-6v-1.1h2.508l.878-7.9Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgItalicIcon
