import type { SVGProps } from 'react'

const SvgMirrorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <mask
      id="prefix__mask0_4319_1231"
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
        fill="url(#prefix__paint0_linear_4319_1231)"
        d="M3 8.024C3 4.283 6.134 1.25 10 1.25s7 3.033 7 6.774v9.697c0 .568-.476 1.029-1.064 1.029H4.064C3.476 18.75 3 18.29 3 17.72V8.025Z"
      />
    </mask>
    <g mask="url(#prefix__mask0_4319_1231)">
      <path
        fill="currentColor"
        d="M3 8.024C3 4.283 6.134 1.25 10 1.25s7 3.033 7 6.774v9.697c0 .568-.476 1.029-1.064 1.029H4.064C3.476 18.75 3 18.29 3 17.72V8.025Z"
      />
    </g>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.168 17.91V8.043c0-3.306-2.761-5.987-6.168-5.987s-6.168 2.68-6.168 5.987v9.865c0 .019.015.034.034.034h12.268a.035.035 0 0 0 .024-.01.034.034 0 0 0 .01-.024ZM10 1.25c-3.866 0-7 3.042-7 6.794v9.865c0 .465.388.841.866.841h12.268a.854.854 0 0 0 .866-.84V8.043c0-3.752-3.134-6.794-7-6.794Z"
      clipRule="evenodd"
    />
    <defs>
      <linearGradient
        id="prefix__paint0_linear_4319_1231"
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
export default SvgMirrorIcon
