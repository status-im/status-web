export default function SwapIcon({
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
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m13.333 2.5 3.334 3.333-3.334 3.334M16.667 5.834H3.333M6.667 17.5l-3.334-3.333 3.334-3.333M3.333 14.166h13.334"
      />
    </svg>
  )
}
