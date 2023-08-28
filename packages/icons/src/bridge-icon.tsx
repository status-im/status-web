import { createIcon } from '../lib/create-icon'

const SvgBridgeIcon = createIcon(props => {
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
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M6.75 2.4h-.485l-.101.472v.002l-.005.018a3.776 3.776 0 0 1-.145.43c-.117.29-.31.674-.61 1.057C4.813 5.13 3.793 5.9 2 5.9v1.2c2.207 0 3.56-.978 4.347-1.98l.053-.068V10.4H2v1.2h4.4v4.9h1.2v-4.9h4.8v4.9h1.2v-4.9H18v-1.2h-4.4V5.052l.053.069C14.44 6.12 15.793 7.1 18 7.1V5.9c-1.793 0-2.815-.772-3.403-1.52a4.396 4.396 0 0 1-.732-1.4l-.024-.088-.004-.018v-.002l-.102-.472h-1.454l-.113.454v.003l-.006.02a5.694 5.694 0 0 1-.125.389 5.77 5.77 0 0 1-.43.932C11.197 4.9 10.665 5.4 10 5.4s-1.196-.499-1.607-1.202a5.78 5.78 0 0 1-.555-1.322l-.005-.019v-.003h-.001L7.718 2.4H6.75Zm5.65 2.782C11.906 5.885 11.129 6.6 10 6.6s-1.906-.715-2.4-1.418V10.4h4.8V5.182Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgBridgeIcon
