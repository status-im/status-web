import type { SVGProps } from 'react'

const LaunchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="none"
    {...props}
  >
    <path
      stroke="#7140FD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 22c-2 1.68-2.666 6.667-2.666 6.667S8.321 28 10.001 26c.946-1.12.933-2.84-.12-3.88A2.907 2.907 0 0 0 6 22ZM16 20.002l-4-4a29.328 29.328 0 0 1 2.667-5.267 17.172 17.172 0 0 1 14.666-8.067c0 3.627-1.04 10-8 14.667A29.798 29.798 0 0 1 16 20.002Z"
    />
    <path
      stroke="#7140FD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 16H5.335s.733-4.04 2.667-5.333c2.16-1.44 6.666 0 6.666 0M16 19.999v6.666s4.04-.733 5.333-2.666c1.44-2.16 0-6.667 0-6.667"
    />
  </svg>
)
export default LaunchIcon
