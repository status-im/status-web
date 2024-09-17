import type { SVGProps } from 'react'

const SvgReplyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m5.545 3.11-3 3.5L2.21 7l.335.39 3 3.5.91-.78-2.15-2.51H8.5a3.9 3.9 0 0 1 3.9 3.9V13h1.2v-1.5a5.1 5.1 0 0 0-5.1-5.1H4.305l2.15-2.51-.91-.78Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgReplyIcon