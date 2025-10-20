'use client'

import { useEffect, useState } from 'react'

const words = [
  'Freedom',
  '자유',
  'حرية',
  'Liberdade',
  '自由',
  'Свобода',
  'آزادی',
  'Liberté',
]

export const WordAnimation = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex(prevWordIndex => (prevWordIndex + 1) % words.length)
    }, 1500)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const currentWord = words[currentWordIndex]

  return (
    <div className="text-76 font-bold leading-none tracking-tight text-neutral-80/5 lg:text-240">
      {currentWord}
    </div>
  )
}
