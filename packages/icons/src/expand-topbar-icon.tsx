import { createIcon } from '../lib/create-icon'

const SvgExpandTopbarIcon = createIcon(props => {
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
        d="M17.377 7C16.962 3.172 15.33 2.5 10 2.5c-5.331 0-6.963.672-7.377 4.5h14.754Z"
        clipRule="evenodd"
        opacity={0.12}
      />
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M3.243 6.242c.011-.095.024-.187.038-.277.148-.978.4-1.548.768-1.916.368-.368.938-.62 1.916-.768.98-.149 2.28-.181 4.035-.181 1.755 0 3.055.032 4.035.18.978.149 1.547.4 1.916.77.368.368.62.937.768 1.915.014.09.026.182.038.277a18.93 18.93 0 0 0-.69-.088C14.913 6.026 13.015 5.9 10 5.9s-4.913.126-6.066.254c-.27.03-.498.06-.691.088Zm-.099 1.231c.216-.037.517-.082.922-.127C5.164 7.224 7.016 7.1 10 7.1c2.985 0 4.837.125 5.934.246.405.045.706.09.922.127.034.718.044 1.552.044 2.527 0 1.755-.032 3.055-.18 4.035-.149.977-.4 1.547-.77 1.916-.368.368-.937.62-1.915.768-.98.149-2.28.18-4.035.18-1.755 0-3.055-.031-4.035-.18-.978-.148-1.548-.4-1.916-.768-.368-.369-.62-.938-.768-1.916-.149-.98-.181-2.28-.181-4.035 0-.975.01-1.81.044-2.527ZM10 1.9c-1.745 0-3.133.03-4.215.194C4.7 2.26 3.832 2.57 3.2 3.201c-.632.631-.942 1.499-1.107 2.584C1.93 6.867 1.9 8.255 1.9 10c0 1.745.03 3.133.194 4.215.165 1.085.475 1.953 1.107 2.584.631.632 1.499.942 2.584 1.107 1.082.164 2.47.194 4.215.194 1.745 0 3.133-.03 4.215-.194 1.085-.165 1.953-.475 2.584-1.107.632-.632.942-1.5 1.107-2.584.164-1.083.194-2.47.194-4.215 0-1.745-.03-3.132-.194-4.215-.165-1.085-.475-1.953-1.107-2.584-.631-.632-1.5-.942-2.584-1.107C13.133 1.93 11.745 1.9 10 1.9Zm2.924 10.524-2.5 2.5-.424.425-.424-.425-2.5-2.5.848-.848L9.4 13.052V8.5h1.2v4.552l1.476-1.476.848.848Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgExpandTopbarIcon