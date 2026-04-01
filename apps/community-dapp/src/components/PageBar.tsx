import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export const PageBar = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isFixed, setIsFixed] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const cachedRef = ref.current
    const cachedRefTop = cachedRef.offsetTop
    const headerHeight = 96

    onScroll()
    function onScroll() {
      const { scrollY } = window

      if (scrollY + headerHeight >= cachedRefTop) {
        setIsFixed(true)
      } else {
        setIsFixed(false)
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <StyledPageBar className={isFixed ? ' isFixed' : ''} ref={ref}>
        <PageBarContainer>{children}</PageBarContainer>
      </StyledPageBar>
      <PageBarPlaceholder isFixed={isFixed} />
    </>
  )
}

interface PageBarPlaceholderProps {
  isFixed: boolean
}

const PageBarPlaceholder = styled.div<PageBarPlaceholderProps>`
  height: ${({ isFixed }) => (isFixed ? '79px' : 0)};
`

const PageBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
`

const StyledPageBar = styled.div`
  width: 100%;
  padding: 24px 0 16px;
  background: #fff;
  z-index: 110;

  &.isFixed {
    position: fixed;
    left: 0;
    top: 95px;
    box-shadow: 0px 6px 6px -6px rgba(0, 0, 0, 0.15);

    @media (max-width: 1024px) {
      padding: 24px 32px 16px;
    }

    @media (max-width: 600px) {
      top: 186px;
      padding: 16px;
    }

    ${PageBarContainer} {
      max-width: 936px;
    }
  }
`
