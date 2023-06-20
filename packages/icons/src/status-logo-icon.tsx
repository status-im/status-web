import { createIcon } from '../lib/create-icon'

const SvgStatusLogoIcon = createIcon(props => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      fill="none"
      viewBox="0 0 20 20"
      focusable={false}
      aria-hidden={true}
    >
      <g clipPath="url(#status-logo-icon_svg__a)">
        <path
          fill={props.color}
          fillRule="evenodd"
          d="M15.374 4.626a3.6 3.6 0 0 0-5.091 0L8.869 6.04l.848.849 1.415-1.414a2.4 2.4 0 1 1 3.394 3.394l-1.415 1.414.849.848 1.414-1.414a3.6 3.6 0 0 0 0-5.091Zm-9.9 6.505L6.89 9.717l-.85-.847-1.414 1.414a3.6 3.6 0 0 0 5.091 5.091l1.415-1.414-.85-.849-1.413 1.414a2.4 2.4 0 1 1-3.394-3.394Zm-.353-6.859-.848.849 10.606 10.607.849-.849L5.12 4.272Z"
          clipRule="evenodd"
        />
        <g clipPath="url(#status-logo-icon_svg__b)">
          <g clipPath="url(#status-logo-icon_svg__c)">
            <mask
              id="status-logo-icon_svg__d"
              width={16}
              height={17}
              x={2}
              y={1}
              maskUnits="userSpaceOnUse"
              style={{
                maskType: 'alpha',
              }}
            >
              <path
                fill="#fff"
                d="M10 2c-6 0-8 2-8 8s2 8 8 8 8-2 8-8-2-8-8-8Z"
              />
            </mask>
            <g mask="url(#status-logo-icon_svg__d)">
              <g filter="url(#status-logo-icon_svg__e)">
                <circle cx={13.5} cy={6.5} r={9.5} fill="#1992D7" />
              </g>
              <g filter="url(#status-logo-icon_svg__f)">
                <circle cx={18.5} cy={11.5} r={9.5} fill="#F6B03C" />
              </g>
              <g filter="url(#status-logo-icon_svg__g)">
                <circle cx={4.5} cy={17.5} r={9.5} fill="#FF7D46" />
              </g>
              <g filter="url(#status-logo-icon_svg__h)">
                <circle cx={-1.5} cy={6.5} r={9.5} fill="#7140FD" />
              </g>
              <g
                fill="#fff"
                fillRule="evenodd"
                clipRule="evenodd"
                filter="url(#status-logo-icon_svg__i)"
              >
                <path d="M11.828 10.43c-.13 1.633-1.302 3.075-2.888 3.165-.974.056-1.948-.539-2-1.505-.04-.777.44-1.345 1.28-1.562.198-.052.401-.084.606-.094.891-.05 1.45.154 2.341.103.206-.01.41-.041.61-.092l.051-.014Zm-3.652-.861c.13-1.632 1.302-3.074 2.888-3.165.974-.055 1.947.54 2 1.506.043.777-.44 1.344-1.28 1.562a3.02 3.02 0 0 1-.606.094c-.892.05-1.45-.154-2.341-.104a3.07 3.07 0 0 0-.61.092l-.051.015Z" />
              </g>
            </g>
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="status-logo-icon_svg__e"
          width={28.43}
          height={28.43}
          x={-0.715}
          y={-7.715}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_4408_955"
            stdDeviation={2.358}
          />
        </filter>
        <filter
          id="status-logo-icon_svg__f"
          width={28.43}
          height={28.43}
          x={4.285}
          y={-2.715}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_4408_955"
            stdDeviation={2.358}
          />
        </filter>
        <filter
          id="status-logo-icon_svg__g"
          width={28.43}
          height={28.43}
          x={-9.715}
          y={3.285}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_4408_955"
            stdDeviation={2.358}
          />
        </filter>
        <filter
          id="status-logo-icon_svg__h"
          width={28.43}
          height={28.43}
          x={-15.715}
          y={-7.715}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_4408_955"
            stdDeviation={2.358}
          />
        </filter>
        <filter
          id="status-logo-icon_svg__i"
          width={36.229}
          height={37.298}
          x={-8.112}
          y={-4.636}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={4.013} />
          <feGaussianBlur stdDeviation={7.525} />
          <feColorMatrix values="0 0 0 0 0.0352941 0 0 0 0 0.0627451 0 0 0 0 0.109804 0 0 0 0.12 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4408_955"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_4408_955"
            result="shape"
          />
        </filter>
        <clipPath id="status-logo-icon_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
        <clipPath id="status-logo-icon_svg__b">
          <path fill="#fff" d="M2 2h16v16H2z" />
        </clipPath>
        <clipPath id="status-logo-icon_svg__c">
          <path fill="#fff" d="M2 2h16v16H2z" />
        </clipPath>
      </defs>
    </svg>
  )
})

export default SvgStatusLogoIcon
