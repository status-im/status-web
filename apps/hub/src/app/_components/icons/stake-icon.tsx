export default function StakeIcon({
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
        d="M15.833 2.5H4.167c-.92 0-1.667.746-1.667 1.667v11.666c0 .92.746 1.667 1.667 1.667h11.666c.92 0 1.667-.746 1.667-1.667V4.167c0-.92-.746-1.667-1.667-1.667Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.293 6.73a.417.417 0 1 0 0-.834.417.417 0 0 0 0 .834ZM6.583 6.584l2.218 2.221M13.708 6.73a.417.417 0 1 0 0-.833.417.417 0 0 0 0 .833ZM11.207 8.805l2.21-2.221M6.298 14.11a.417.417 0 1 0 0-.833.417.417 0 0 0 0 .834ZM6.583 13.417l2.198-2.222M13.684 14.14a.417.417 0 1 0 0-.833.417.417 0 0 0 0 .833ZM11.203 11.219l2.213 2.198M10 11.667a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333Z"
      />
    </svg>
  )
}
