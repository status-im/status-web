import { useEffect } from 'react'

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const path = event.composedPath()
      if (ref.current && !path.includes(ref.current)) {
        callback()
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [ref, callback])

  return ref
}
