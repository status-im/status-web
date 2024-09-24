import type { SVGProps } from 'react'

const SvgKeyTabIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m8.923 5.648-2.5-3-.846.704L7.326 5.45H1.5v1.1h5.826L5.577 8.648l.846.704 2.5-3L9.216 6l-.293-.352ZM9.95 3h1.1v6h-1.1V3Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgKeyTabIcon
