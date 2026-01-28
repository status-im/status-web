export default function HeartIcon({
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
        d="M1.449 7.442A4.703 4.703 0 0 1 9.65 4.298a.48.48 0 0 0 .7 0 4.695 4.695 0 0 1 8.201 3.144c0 1.958-1.283 3.42-2.565 4.703l-4.697 4.543a1.71 1.71 0 0 1-2.565.016l-4.71-4.56C2.731 10.863 1.45 9.409 1.45 7.443"
      />
    </svg>
  )
}
