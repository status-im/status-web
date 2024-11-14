import { cva } from 'cva'
import { match } from 'ts-pattern'

type Props = {
  status: 'on' | 'off'
}

const styles = cva({
  base: 'flex h-6 items-center gap-1 rounded-[20px] border px-2 text-13',
  variants: {
    status: {
      on: 'border-success-50/20 bg-success-50/10 text-success-60',
      off: 'border-danger-50/20 bg-danger-50/10 text-danger-60',
    },
  },
})

const StatusTag = (props: Props) => {
  const { status } = props

  return (
    <div className={styles({ status })}>
      {match(status)
        .with('on', () => (
          <>
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5l-1.5 3H10L4.5 10 5 7H2l2.5-5.5H8z"
                stroke="#1C8A80"
                strokeWidth={1.1}
              />
            </svg>
            <span className="text-success-60">Status desktop running</span>
          </>
        ))
        .with('off', () => (
          <>
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.45 1v4.5h1.1V1h-1.1zm2.525 1.58a3.95 3.95 0 11-3.95 0l-.55-.954a5.05 5.05 0 105.05 0l-.55.953z"
                fill="#BA434D"
              />
            </svg>
            <span className="text-danger-60">Status desktop not running</span>
          </>
        ))
        .exhaustive()}
    </div>
  )
}

export { StatusTag }
