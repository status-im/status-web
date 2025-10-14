import type { SVGProps } from 'react'

export default function VaultIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={50}
      fill="none"
      className={className}
      {...props}
    >
      <path
        stroke="#7140FD"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M39.583 6.25H10.417a4.167 4.167 0 0 0-4.167 4.167v29.166a4.167 4.167 0 0 0 4.167 4.167h29.166a4.167 4.167 0 0 0 4.167-4.167V10.417a4.167 4.167 0 0 0-4.167-4.167Z"
      />
      <path
        stroke="#7140FD"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M15.732 16.826a1.042 1.042 0 1 0 0-2.084 1.042 1.042 0 0 0 0 2.084ZM16.458 16.459l5.543 5.553M34.27 16.826a1.042 1.042 0 1 0 0-2.084 1.042 1.042 0 0 0 0 2.084ZM28.018 22.012l5.523-5.553M15.744 35.277a1.042 1.042 0 1 0 0-2.084 1.042 1.042 0 0 0 0 2.084ZM16.459 33.542l5.494-5.554M34.21 35.349a1.042 1.042 0 1 0 0-2.083 1.042 1.042 0 0 0 0 2.083ZM28.008 28.047l5.533 5.495M25 29.167a4.167 4.167 0 1 0 0-8.333 4.167 4.167 0 0 0 0 8.333Z"
      />
    </svg>
  )
}
