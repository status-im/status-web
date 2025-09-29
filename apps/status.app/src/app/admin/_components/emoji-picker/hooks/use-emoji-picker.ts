import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'

import emojis from 'emoji-datasource-twitter'

import { matchesSearchFilter } from '~admin/_utils'
import { useDebounce } from '~hooks/use-debounce'
import { useLocalStorage } from '~hooks/use-local-storage'

import type { Category } from '..'
import type { Emoji } from '../emoji-twitter'

type UseEmojiPickerProps = {
  onSelect: (emoji: Emoji) => void
}

type CategoryRefs = {
  [key in Category]?: HTMLButtonElement | null
}

type State = {
  search: string
  popoverReady: boolean
  isOpen: boolean
  activeCategory: Category | null
  indicatorStyle: React.CSSProperties
  isProgrammaticallyScrolling: boolean
}

type Action =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_POPOVER_READY'; payload: boolean }
  | { type: 'SET_IS_OPEN'; payload: boolean }
  | { type: 'SET_ACTIVE_CATEGORY'; payload: Category }
  | { type: 'SET_INDICATOR_STYLE'; payload: React.CSSProperties }
  | { type: 'SET_IS_PROGRAMMATICALLY_SCROLLING'; payload: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload }
    case 'SET_POPOVER_READY':
      return { ...state, popoverReady: action.payload }
    case 'SET_IS_OPEN':
      return { ...state, isOpen: action.payload }
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload }
    case 'SET_INDICATOR_STYLE':
      return { ...state, indicatorStyle: action.payload }
    case 'SET_IS_PROGRAMMATICALLY_SCROLLING':
      return { ...state, isProgrammaticallyScrolling: action.payload }
    default:
      return state
  }
}

// Utils
const getFirstActiveCategory = (recentEmojiCount: number): Category =>
  recentEmojiCount > 0 ? 'Frequently used' : 'Smileys & Emotion'

const DEFAULT_INDICATOR_STYLE = {
  width: '32px',
  transform: 'translateX(16px)',
}

const emojisListByCategory = emojis
  .filter(emoji => emoji.has_img_twitter)
  .reverse()
  .reduce(
    (acc, emoji) => {
      // Adds recent category with empty array
      if (!acc['Recent']) {
        acc['Recent'] = []
      }

      const { name, category, unified, sort_order } = emoji
      const char = unified
        .split('-')
        .map(hex => String.fromCodePoint(parseInt(hex, 16)))
        .join('')

      if (!acc[category]) {
        acc[category] = []
      }

      acc[category].push({ char, name, sort_order })
      acc[category].sort((a, b) => a.sort_order - b.sort_order)
      return acc
    },
    {} as Record<string, { char: string; name: string; sort_order: number }[]>
  )

const emojisForSearch = Object.values(emojisListByCategory).flat()

const initialState: State = {
  search: '',
  popoverReady: false,
  isOpen: false,
  activeCategory: null,
  indicatorStyle: DEFAULT_INDICATOR_STYLE,
  isProgrammaticallyScrolling: false,
}

const useEmojiPicker = (props: UseEmojiPickerProps) => {
  const { onSelect } = props

  const [recentEmojis, setRecentEmojis] = useLocalStorage<Emoji[]>(
    'recentEmojis',
    []
  )

  const [state, dispatch] = useReducer(reducer, initialState)

  const categoryGridContainerRefs = useRef<{
    [key: string]: HTMLDivElement | null
  }>({})
  const titleCategoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const scrollableContainerRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<CategoryRefs>({})

  const resetIndicatorStyle = () => {
    dispatch({ type: 'SET_INDICATOR_STYLE', payload: DEFAULT_INDICATOR_STYLE })
  }

  const debouncedSearch = useDebounce(state.search)

  const handleOpenChange = (open: boolean) => {
    dispatch({ type: 'SET_IS_OPEN', payload: open })
    if (open) {
      setTimeout(
        () => dispatch({ type: 'SET_POPOVER_READY', payload: true }),
        200
      )
    } else {
      dispatch({ type: 'SET_POPOVER_READY', payload: false })
      resetIndicatorStyle()
      dispatch({ type: 'SET_SEARCH', payload: '' })
    }
  }

  const setActiveCategoryRef = useCallback((category: Category) => {
    const activeCategory = categoryRefs.current[category]

    if (activeCategory) {
      dispatch({
        type: 'SET_INDICATOR_STYLE',
        payload: {
          width: `${activeCategory.offsetWidth}px`,
          transform: `translateX(${activeCategory.offsetLeft}px)`,
        },
      })
    }
  }, [])

  const handleOnSelectEmoji = (emoji: Emoji) => {
    onSelect(emoji)
    setRecentEmojis([
      // 16 is the maximum number of recent emojis
      emoji,
      ...recentEmojis.filter(e => e.char !== emoji.char).slice(0, 15),
    ])
    dispatch({
      type: 'SET_ACTIVE_CATEGORY',
      payload: getFirstActiveCategory(recentEmojis.length),
    })
    handleOpenChange(false)
    resetIndicatorStyle()
  }

  const scrollToCategory = useCallback(
    (categoryName: Category) => {
      const titleRef = titleCategoryRefs.current[categoryName]

      if (titleRef) {
        setActiveCategoryRef(categoryName)
        dispatch({ type: 'SET_IS_PROGRAMMATICALLY_SCROLLING', payload: true })

        titleRef.scrollIntoView({
          behavior: 'smooth',
        })
      }

      const timeOutId = setTimeout(() => {
        dispatch({ type: 'SET_IS_PROGRAMMATICALLY_SCROLLING', payload: false })
      }, 1000)

      return () => {
        clearTimeout(timeOutId)
      }
    },
    [setActiveCategoryRef]
  )

  useEffect(() => {
    if (debouncedSearch === '') {
      dispatch({
        type: 'SET_ACTIVE_CATEGORY',
        payload: getFirstActiveCategory(recentEmojis.length),
      })
      resetIndicatorStyle()
    }
  }, [debouncedSearch, recentEmojis])

  useEffect(() => {
    if (!state.popoverReady || state.isProgrammaticallyScrolling) return

    const scrollContainer = scrollableContainerRef.current
    let animationFrameId = 0

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId)

      animationFrameId = requestAnimationFrame(() => {
        const scrollTop = scrollContainer?.scrollTop ?? 0
        let detectedActiveCategory = null

        Object.entries(titleCategoryRefs.current).forEach(([category, ref]) => {
          if (!ref) return
          const { offsetTop } = ref

          if (scrollTop >= offsetTop - 1) {
            detectedActiveCategory = category

            setActiveCategoryRef(category as Category)
          }
        })

        if (
          detectedActiveCategory &&
          detectedActiveCategory !== state.activeCategory
        ) {
          dispatch({
            type: 'SET_ACTIVE_CATEGORY',
            payload: detectedActiveCategory as Category,
          })
        }
      })
    }

    scrollContainer?.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [
    setActiveCategoryRef,
    state.popoverReady,
    state.isProgrammaticallyScrolling,
    state.activeCategory,
  ])

  const emojisResults = useMemo(() => {
    return emojisForSearch.filter(emoji =>
      matchesSearchFilter(emoji.name, debouncedSearch)
    )
  }, [debouncedSearch])

  const noResults = emojisResults.length === 0

  return {
    isOpen: state.isOpen,
    search: state.search,
    setSearch: (search: string) =>
      dispatch({ type: 'SET_SEARCH', payload: search }),
    activeCategory: state.activeCategory,
    indicatorStyle: state.indicatorStyle,
    categoryGridContainerRefs,
    titleCategoryRefs,
    scrollableContainerRef,
    categoryRefs,
    handleOpenChange,
    handleOnSelectEmoji,
    scrollToCategory,
    emojisResults,
    noResults,
    debouncedSearch,
    emojisListByCategory,
    recentEmojis,
  }
}

export { useEmojiPicker }
