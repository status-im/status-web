import type { SVGProps } from 'react'

const SvgUpvoteIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m14.924 11.924-.4.4-.423-.376-4.1-3.645-4.102 3.645-.423.376-.4-.4-2-2-.442-.441.46-.424 6.5-6L10 2.683l.407.376 6.5 6 .459.424-.442.441-2 2ZM10.4 7.051l4.077 3.625 1.158-1.159L10 4.317l-5.634 5.2 1.158 1.159L9.601 7.05l.4-.354.398.354ZM8.6 14.5a1.4 1.4 0 1 1 2.8 0 1.4 1.4 0 0 1-2.8 0Zm1.4-2.6a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgUpvoteIcon
