import React from 'react'

export const EditIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={21}
      height={21}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.25 2.5a.75.75 0 000-1.5H4a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4v-5.25a.75.75 0 00-1.5 0V17a2.5 2.5 0 01-2.5 2.5H4A2.5 2.5 0 011.5 17V5A2.5 2.5 0 014 2.5h5.25z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.28 1.72a2.518 2.518 0 00-3.56 0l-8.384 8.383c-.33.33-.571.74-.7 1.19l-.857 3.001a.75.75 0 00.927.927l3.002-.857a2.75 2.75 0 001.189-.7l8.383-8.383a2.518 2.518 0 000-3.561zm-2.5 1.06a1.018 1.018 0 011.44 1.44l-8.384 8.383c-.15.15-.336.26-.54.318a.984.984 0 01-1.217-1.216 1.25 1.25 0 01.318-.54L16.78 2.78z"
        fill="currentColor"
      />
    </svg>
  )
}
