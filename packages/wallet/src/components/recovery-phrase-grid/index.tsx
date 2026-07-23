'use client'

import { useRef } from 'react'

import { wordlist as english } from '@scure/bip39/wordlists/english'

import { isValidWordCount, MAX_WORD_COUNT } from './constants'
import { WordInput } from './word-input'

const englishWords = new Set(english)

type Props = {
  words: string[]
  onWordsChange: (words: string[]) => void
}

function RecoveryPhraseGrid(props: Props) {
  const { words, onWordsChange } = props

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const focusInput = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, words.length - 1))
    inputRefs.current[clampedIndex]?.focus()
  }

  const handleWordChange = (index: number, value: string) => {
    onWordsChange(words.map((word, i) => (i === index ? value : word)))
  }

  const handlePasteWords = (index: number, pastedWords: string[]) => {
    // A full phrase pasted anywhere replaces the whole grid and adjusts
    // the word count to match.
    if (isValidWordCount(pastedWords.length)) {
      onWordsChange(pastedWords)
      requestAnimationFrame(() => focusInput(pastedWords.length - 1))
      return
    }

    const partialWords = pastedWords.slice(0, MAX_WORD_COUNT)
    const nextWords = words.map((word, i) => {
      const pastedIndex = i - index
      return pastedIndex >= 0 && pastedIndex < partialWords.length
        ? partialWords[pastedIndex]
        : word
    })

    onWordsChange(nextWords)
    requestAnimationFrame(() => focusInput(index + partialWords.length))
  }

  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {words.map((word, index) => (
        <WordInput
          key={index}
          ref={element => {
            inputRefs.current[index] = element
          }}
          index={index}
          value={word}
          invalid={word !== '' && !englishWords.has(word)}
          shouldAutoFocus={index === 0}
          isLast={index === words.length - 1}
          onValueChange={value => handleWordChange(index, value)}
          onPasteWords={pastedWords => handlePasteWords(index, pastedWords)}
          onFocusPrevious={() => focusInput(index - 1)}
          onFocusNext={() => focusInput(index + 1)}
        />
      ))}
    </div>
  )
}

export { RecoveryPhraseGrid }
