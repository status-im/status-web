const DropdownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" clipPath="url(#a)">
        <circle cx="6" cy="6" r="5" strokeWidth="1.2" />
        <path strokeWidth="1.1" d="M3.5 5 6 7.5 8.5 5" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h12v12H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export { DropdownIcon }
