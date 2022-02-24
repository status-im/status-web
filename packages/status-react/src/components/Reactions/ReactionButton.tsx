import React, { useRef, useState } from 'react'

import styled from 'styled-components'

import { useClickOutside } from '../../hooks/useClickOutside'
import { Tooltip } from '../Form/Tooltip'
import { ReactionSvg } from '../Icons/ReactionIcon'
import { ReactionPicker } from './ReactionPicker'

import type { BaseEmoji } from 'emoji-mart'

interface ReactionButtonProps {
  className?: string
  messageReactions: BaseEmoji[]
  setMessageReactions: React.Dispatch<React.SetStateAction<BaseEmoji[]>>
}

export function ReactionButton({
  className,
  messageReactions,
  setMessageReactions,
}: ReactionButtonProps) {
  const ref = useRef(null)
  useClickOutside(ref, () => setShowReactions(false))

  const [showReactions, setShowReactions] = useState(false)

  return (
    <Wrapper ref={ref}>
      {showReactions && (
        <ReactionPicker
          messageReactions={messageReactions}
          setMessageReactions={setMessageReactions}
          className={className}
        />
      )}
      <ReactionBtn
        onClick={() => setShowReactions(!showReactions)}
        className={className}
      >
        <ReactionSvg className={className} />
        {!className && !showReactions && <Tooltip tip="Add reaction" />}
      </ReactionBtn>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
`

export const ReactionBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  align-self: center;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }

  &.red:hover {
    background: ${({ theme }) => theme.buttonNoBgHover};
  }

  &:hover > svg {
    fill: ${({ theme }) => theme.tertiary};
  }

  &.red:hover > svg {
    fill: ${({ theme }) => theme.redColor};
  }

  &:hover > div {
    visibility: visible;
  }

  &.small {
    width: 18px;
    height: 18px;
    padding: 0;

    &:hover {
      background: inherit;
    }
  }
`
