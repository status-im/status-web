import type { SVGProps } from 'react'

const SvgPlaceholderIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M10 3.6c-1.533 0-2.94.54-4.043 1.438L10 9.081l4.043-4.043A6.374 6.374 0 0 0 10 3.6Zm4.962 2.357L10.919 10l4.043 4.043A6.373 6.373 0 0 0 16.4 10c0-1.533-.539-2.94-1.438-4.043ZM9.08 10 5.038 5.957A6.374 6.374 0 0 0 3.6 10c0 1.533.54 2.94 1.438 4.043L9.081 10Zm-3.124 4.962L10 10.919l4.043 4.043A6.374 6.374 0 0 1 10 16.4c-1.533 0-2.94-.54-4.043-1.438ZM2.4 10a7.6 7.6 0 1 1 15.2 0 7.6 7.6 0 0 1-15.2 0Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgPlaceholderIcon
