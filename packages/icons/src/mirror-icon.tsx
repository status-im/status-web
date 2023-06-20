import { createIcon } from '../lib/create-icon'

const SvgMirrorIcon = createIcon(props => {
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
      <mask
        id="mirror-icon_svg__b"
        width={14}
        height={18}
        x={3}
        y={1}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill="url(#mirror-icon_svg__a)"
          d="M3 8.024C3 4.283 6.134 1.25 10 1.25s7 3.033 7 6.774v9.697c0 .568-.476 1.029-1.064 1.029H4.064C3.476 18.75 3 18.29 3 17.72V8.025Z"
        />
      </mask>
      <g mask="url(#mirror-icon_svg__b)">
        <path
          fill={props.color}
          d="M3 8.024C3 4.283 6.134 1.25 10 1.25s7 3.033 7 6.774v9.697c0 .568-.476 1.029-1.064 1.029H4.064C3.476 18.75 3 18.29 3 17.72V8.025Z"
        />
      </g>
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M16.168 17.91V8.043c0-3.306-2.761-5.987-6.168-5.987s-6.168 2.68-6.168 5.987v9.865c0 .019.015.034.034.034h12.268a.035.035 0 0 0 .024-.01.034.034 0 0 0 .01-.024ZM10 1.25c-3.866 0-7 3.042-7 6.794v9.865c0 .465.388.841.866.841h12.268a.854.854 0 0 0 .866-.84V8.043c0-3.752-3.134-6.794-7-6.794Z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id="mirror-icon_svg__a"
          x1={4.802}
          x2={16.484}
          y1={2.259}
          y2={21.408}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.266} stopColor="#fff" stopOpacity={0} />
          <stop offset={0.734} stopColor="#3E7EF7" />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgMirrorIcon
