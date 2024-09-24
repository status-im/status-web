import type { SVGProps } from 'react'

const SvgCloseIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m9.153 10-4.576 4.575.848.849 4.576-4.576 4.576 4.576.848-.848L10.85 10l4.575-4.576-.848-.849L10 9.151 5.425 4.576l-.848.848L9.153 10Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgCloseIcon
