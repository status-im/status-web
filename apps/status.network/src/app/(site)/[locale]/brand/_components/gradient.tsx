const Gradient = () => (
  <svg
    width="380"
    height="112"
    viewBox="0 0 380 112"
    className="absolute inset-0 z-0 size-full"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#a)">
      <g filter="url(#b)">
        <ellipse cx="126.5" cy="44" rx="242.5" ry="160" fill="#7140FD" />
      </g>
      <g filter="url(#c)">
        <ellipse
          cx="119.479"
          cy="178.706"
          rx="119.479"
          ry="178.706"
          transform="matrix(.73057 .68284 -.88078 .47352 429.803 -65.924)"
          fill="#5337AD"
        />
      </g>
    </g>
    <defs>
      <filter
        id="b"
        x="-236"
        y="-236"
        width="725"
        height="560"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          stdDeviation="60"
          result="effect1_foregroundBlur_1219_2168"
        />
      </filter>
      <filter
        id="c"
        x="59.672"
        y="-137.263"
        width="600.034"
        height="475.089"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          stdDeviation="60"
          result="effect1_foregroundBlur_1219_2168"
        />
      </filter>
      <clipPath id="a">
        <path fill="#fff" transform="translate(.667)" d="M0 0h379v112H0z" />
      </clipPath>
    </defs>
  </svg>
)

export { Gradient }
