export default function BridgeIcon({
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
        strokeWidth="1.5"
        d="M4.5 10s1-5 5.5-5 5.5 5 5.5 5"
      />
      <circle
        cx="4.5"
        cy="12.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="15.5"
        cy="12.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}
