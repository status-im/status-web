import type { SVGProps } from 'react'

const SvgSortIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m4.5 1.219.384.32 3 2.5-.768.922L5.1 3.28V14H3.9V3.28L1.884 4.96l-.768-.921 3-2.5.384-.32Zm7.6 11.5V1.999h-1.2v10.72l-2.016-1.68-.768.922 3 2.5.384.32.384-.32 3-2.5-.768-.922-2.016 1.68Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgSortIcon
