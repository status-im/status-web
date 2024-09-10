import type { SVGProps } from 'react'

const SvgGitIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M4.5 5.9a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Zm0 1.1c.473 0 .915-.131 1.292-.36l.987.988a4 4 0 1 0 .849-.849l-.987-.987A2.5 2.5 0 1 0 4.5 7Zm8.4 3a2.9 2.9 0 1 1-5.8 0 2.9 2.9 0 0 1 5.8 0Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgGitIcon
