export default function LaunchIcon({
  className = '',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      className={className}
      {...props}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        clipPath="url(#a-launch-icon)"
      >
        <path d="M6 22c-2 1.68-2.667 6.667-2.667 6.667S8.32 28 10 26c.946-1.12.933-2.84-.12-3.88A2.907 2.907 0 0 0 6 22ZM16 20l-4-4a29.325 29.325 0 0 1 2.667-5.267 17.173 17.173 0 0 1 14.666-8.067c0 3.627-1.04 10-8 14.667A29.798 29.798 0 0 1 16 20Z" />
        <path d="M12 16H5.333S6.066 11.96 8 10.668c2.16-1.44 6.666 0 6.666 0M16 20v6.667s4.04-.733 5.333-2.666c1.44-2.16 0-6.667 0-6.667" />
      </g>
      <defs>
        <clipPath id="a-launch-icon">
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
