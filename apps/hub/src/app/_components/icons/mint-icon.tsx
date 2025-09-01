export default function MintIcon({
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
      <g clipPath="url(#a-mint)">
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          clipPath="url(#b-mint)"
        >
          <path d="M10 18.333a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667Z" />
          <path d="M13.333 6.666h-5a1.667 1.667 0 1 0 0 3.333h3.334a1.666 1.666 0 1 1 0 3.334h-5M10 15V5" />
        </g>
      </g>
      <defs>
        <clipPath id="a-mint">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
        <clipPath id="b-mint">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
