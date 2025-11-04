import type { SVGProps } from 'react'

const ProcessingIcon = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}
  >
    <path
      stroke="#7140FD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M43.75 25A18.75 18.75 0 0 0 25 6.25a20.313 20.313 0 0 0-14.042 5.708L6.25 16.667"
    />
    <path
      stroke="#7140FD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M6.25 6.25v10.417h10.417M6.25 25A18.75 18.75 0 0 0 25 43.75a20.312 20.312 0 0 0 14.042-5.708l4.708-4.709"
    />
    <path
      stroke="#7140FD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M33.334 33.336h10.417v10.417"
    />
  </svg>
)
export default ProcessingIcon
