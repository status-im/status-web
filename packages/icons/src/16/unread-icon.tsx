import type { SVGProps } from 'react'

const SvgUnreadIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M2 3.4h12v1.2H2V3.4Zm2 4h8v1.2H4V7.4Zm6 4H6v1.2h4v-1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgUnreadIcon
