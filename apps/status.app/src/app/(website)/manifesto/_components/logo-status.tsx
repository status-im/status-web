const LogoStatus = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 592 692"
      fill="none"
      width={592}
      style={{ maxWidth: '100%' }}
    >
      <g filter="url(#a)">
        <path
          fill="#1B273D"
          fillOpacity=".05"
          fillRule="evenodd"
          d="M398.749.345C245.628 9.091 132.57 148.14 120 305.445a101.43 101.43 0 0 1 2.481-.71c.854-.237 1.709-.474 2.481-.711a301.235 301.235 0 0 1 58.808-8.854c42.993-2.404 77.957 1.316 112.916 5.035 35.004 3.723 70.003 7.447 113.052 5.022a291.718 291.718 0 0 0 58.514-9.11c81.008-20.988 127.613-75.683 123.496-150.637C586.676 52.343 492.768-5.011 398.749.345Zm-205.51 691.31C346.366 682.908 459.429 543.842 472 386.518c-.969.298-2.069.595-3.135.884-.632.171-1.253.338-1.827.501a301.193 301.193 0 0 1-58.811 8.856c-43.051 2.443-78.051-1.272-113.057-4.987-34.96-3.71-69.926-7.421-112.921-4.999a291.75 291.75 0 0 0-58.516 9.111C42.722 416.839-3.702 471.54.231 546.503c5.073 93.148 98.985 150.509 193.008 145.152Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <filter
          id="a"
          width="672"
          height="772"
          x="-40"
          y="-40"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="20" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4340_139726"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4340_139726"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

export { LogoStatus }
