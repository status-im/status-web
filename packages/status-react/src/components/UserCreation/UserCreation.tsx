import React from 'react'

import styled from 'styled-components'

import { useNarrow } from '../../contexts/narrowProvider'
import { ColorChatIcon } from '../Icons/ColorChatIcon'
import { UserCreationButtons } from './UserCreationButtons'

interface UserCreationProps {
  permission: boolean
}

export function UserCreation({ permission }: UserCreationProps) {
  const narrow = useNarrow()

  if (!narrow) {
    return (
      <Wrapper>
        <ColorChatIcon />
        <TitleWrapper>Want to jump into the discussion?</TitleWrapper>
        <UserCreationButtons permission={permission} />
      </Wrapper>
    )
  } else {
    return null
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
`

const TitleWrapper = styled.div`
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  text-align: center;
  margin: 24px 0;
  color: ${({ theme }) => theme.primary};
`
