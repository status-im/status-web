import { useState } from 'react'

import { validateMnemonic } from '@scure/bip39'
import { wordlist as english } from '@scure/bip39/wordlists/english'
import { Button, DropdownButton, DropdownMenu } from '@status-im/components'
import { AlertIcon, DeleteIcon, LoadingIcon } from '@status-im/icons/20'

import { RecoveryPhraseGrid } from '../recovery-phrase-grid'
import {
  DEFAULT_WORD_COUNT,
  isValidWordCount,
  MAX_WORD_COUNT,
  VALID_WORD_COUNTS,
} from '../recovery-phrase-grid/constants'

import type { WordCount } from '../recovery-phrase-grid/constants'

type FormValues = {
  mnemonic: string
}

type ImportRecoveryPhraseFormProps = {
  onSubmit: (data: FormValues) => void
  loading: boolean
  defaultValues: FormValues
}

const createEmptyWords = (count: number): string[] =>
  Array.from({ length: count }, () => '')

const wordsFromMnemonic = (mnemonic: string): string[] => {
  const words = mnemonic.trim().toLowerCase().split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return createEmptyWords(DEFAULT_WORD_COUNT)
  }

  if (isValidWordCount(words.length)) {
    return words
  }

  const targetCount =
    VALID_WORD_COUNTS.find(count => count >= words.length) ?? MAX_WORD_COUNT

  return [
    ...words.slice(0, targetCount),
    ...createEmptyWords(Math.max(0, targetCount - words.length)),
  ]
}

const ImportRecoveryPhraseForm = ({
  onSubmit,
  loading = false,
  defaultValues,
}: ImportRecoveryPhraseFormProps) => {
  const [words, setWords] = useState<string[]>(() =>
    wordsFromMnemonic(defaultValues.mnemonic),
  )

  const wordCount = words.length
  const hasInput = words.some(word => word !== '')
  const isComplete = words.every(word => word !== '')
  const mnemonic = words.join(' ')
  const isChecksumValid = isComplete && validateMnemonic(mnemonic, english)
  const showError = isComplete && !isChecksumValid

  const handleWordCountChange = (count: WordCount) => {
    setWords(previousWords =>
      count < previousWords.length
        ? previousWords.slice(0, count)
        : [...previousWords, ...createEmptyWords(count - previousWords.length)],
    )
  }

  const handleClear = () => {
    setWords(createEmptyWords(wordCount))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isChecksumValid || loading) {
      return
    }

    onSubmit({ mnemonic })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-1 flex-col justify-between gap-5"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <DropdownMenu.Root>
            <DropdownButton variant="grey" size="40">
              {wordCount} words
            </DropdownButton>
            <DropdownMenu.Content>
              {VALID_WORD_COUNTS.map(count => (
                <DropdownMenu.Item
                  key={count}
                  label={`${count} words`}
                  selected={count === wordCount}
                  onSelect={() => handleWordCountChange(count)}
                />
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <Button
            type="button"
            variant="ghost"
            size="40"
            iconBefore={<DeleteIcon />}
            disabled={!hasInput}
            onPress={handleClear}
          >
            Clear
          </Button>
        </div>

        <RecoveryPhraseGrid words={words} onWordsChange={setWords} />
      </div>

      <div className="mt-auto flex flex-col gap-6">
        {showError && (
          <p className="flex items-center gap-1 text-danger-50">
            <AlertIcon />
            <span className="text-13">
              Invalid phrase. Check word count and spelling.
            </span>
          </p>
        )}

        <Button variant="primary" type="submit" disabled={!isChecksumValid}>
          {loading ? (
            <LoadingIcon className="animate-spin text-white-100" />
          ) : (
            'Fetch accounts'
          )}
        </Button>
      </div>
    </form>
  )
}

export { ImportRecoveryPhraseForm }
export type { FormValues as ImportRecoveryPhraseFormValues }
