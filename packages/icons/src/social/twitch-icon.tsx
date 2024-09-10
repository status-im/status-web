import type { SVGProps } from 'react'

const SvgTwitchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M1.133 4.063 2.316.5h16.55v11.566l-4.728 5.059H10.59L8.227 19.5H5.862v-2.375H1.133V4.062ZM14.374 14.75l3.31-3.563v-9.5H3.498V14.75h4.138v1.86l2.546-1.86h4.192Zm-3.783-9.5H9.41V10h1.182V5.25Zm3.547 0h-1.182V10h1.182V5.25Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgTwitchIcon
