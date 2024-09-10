import type { SVGProps } from 'react'

const SvgExternalIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12.1 4.5v-.6H7v1.2h3.052l-5.976 5.976.848.848L10.9 5.95V9h1.2V4.5Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgExternalIcon
