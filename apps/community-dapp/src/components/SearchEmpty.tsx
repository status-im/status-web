import React from 'react'
import styled from 'styled-components'
import { Colors } from '../constants/styles'

export function SearchEmpty() {
  return (
    <SearchEmptyWrap>
      <p>🔎</p>
      <span>Vote not found</span>
    </SearchEmptyWrap>
  )
}

export const SearchEmptyWrap = styled.div`
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 90px;
  background: ${Colors.White};
  font-size: 22px;
  line-height: 38px;
  z-index: 99;

  & > p {
    font-weight: bold;
    font-size: 64px;
    line-height: 64%;
    margin-bottom: 24px;
  }
`
