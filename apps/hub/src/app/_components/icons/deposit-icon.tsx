export default function DepositIcon({
  className = '',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      className={className}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10 18.333a5.833 5.833 0 0 0 5.833-5.833c0-1.667-.833-3.25-2.5-4.583C11.667 6.583 10.417 4.583 10 2.5c-.417 2.083-1.667 4.083-3.333 5.417C5 9.25 4.167 10.833 4.167 12.5A5.833 5.833 0 0 0 10 18.333Z"
      />
    </svg>
  )
}
