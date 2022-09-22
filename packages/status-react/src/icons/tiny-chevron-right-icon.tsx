import React from 'react'

export const TinyChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.97 4.97a.75.75 0 000 1.06l2.116 2.116a.5.5 0 010 .708L5.97 10.97a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3a.75.75 0 00-1.06 0z"
        fill="currentColor"
      />
    </svg>
  )
}
