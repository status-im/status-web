import type { SVGProps } from 'react'

const SvgUnderlineIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M2.45 1.5c0 2.756.246 4.615.802 5.797.286.606.664 1.06 1.151 1.353.485.293 1.029.4 1.597.4.568 0 1.112-.107 1.597-.4.487-.294.865-.747 1.15-1.353.557-1.182.803-3.04.803-5.797h-1.1c0 2.744-.254 4.385-.698 5.328-.214.456-.461.722-.724.88-.265.161-.596.242-1.028.242-.432 0-.763-.08-1.028-.241-.263-.159-.51-.425-.724-.88-.444-.944-.698-2.585-.698-5.329h-1.1Zm.05 8.45v1.1h7v-1.1h-7Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgUnderlineIcon