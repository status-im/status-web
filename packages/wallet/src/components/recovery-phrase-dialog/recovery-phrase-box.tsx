import { Counter } from '@status-im/components'
import { cx } from 'class-variance-authority'

type Props = {
  mnemonic: string
}

function RecoveryPhraseBox({ mnemonic }: Props) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 rounded-16 bg-neutral-2.5 px-3 py-2">
      {mnemonic.split(' ').map((word, i) => (
        <div
          key={i}
          className={cx(
            'flex items-center gap-2 border-dashed py-2',
            i % 2 === 0 ? 'border-r border-neutral-80/10' : '',
          )}
        >
          <Counter value={i + 1} variant="grey" />
          <span className="font-mono">{word}</span>
        </div>
      ))}
    </div>
  )
}

export { RecoveryPhraseBox }
