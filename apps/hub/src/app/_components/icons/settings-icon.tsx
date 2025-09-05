export default function SettingsIcon({
  className = '',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Replace this with the actual SVG path from Figma */}
      <path
        d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.4 10C18.4 10.4 18.2 10.8 17.8 11L16.2 11.8C16 12 15.8 12.4 15.8 12.6L15.4 14.2C15.2 14.8 14.6 15.2 14 15.2L12.4 15C12.2 15 11.8 15.2 11.6 15.4L10.4 16.6C10 17 9.6 17 9.2 16.6L8 15.4C7.8 15.2 7.4 15 7.2 15L5.6 15.2C5 15.2 4.4 14.8 4.2 14.2L3.8 12.6C3.8 12.4 3.6 12 3.4 11.8L1.8 11C1.4 10.8 1.2 10.4 1.2 10C1.2 9.6 1.4 9.2 1.8 9L3.4 8.2C3.6 8 3.8 7.6 3.8 7.4L4.2 5.8C4.4 5.2 5 4.8 5.6 4.8L7.2 5C7.4 5 7.8 4.8 8 4.6L9.2 3.4C9.6 3 10 3 10.4 3.4L11.6 4.6C11.8 4.8 12.2 5 12.4 5L14 4.8C14.6 4.8 15.2 5.2 15.4 5.8L15.8 7.4C15.8 7.6 16 8 16.2 8.2L17.8 9C18.2 9.2 18.4 9.6 18.4 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
