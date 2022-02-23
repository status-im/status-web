import styled from 'styled-components'

import { textMediumStyles, textSmallStyles } from '../Text'

export const MessageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  border-left: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.inputColor};
    border-color: ${({ theme }) => theme.inputColor};
  }

  &:hover > div {
    visibility: visible;
  }

  &.mention {
    background: ${({ theme }) => theme.mentionBg};
    border-color: ${({ theme }) => theme.mentionColor};
  }

  &.mention:hover {
    background: ${({ theme }) => theme.mentionBgHover};
    border-color: ${({ theme }) => theme.mentionColor};
  }
`

export const MessageOuterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

export const DateSeparator = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  height: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  color: #939ba1;
  margin-top: 16px;
  margin-bottom: 16px;

  ${textSmallStyles}
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`

export const MessageHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const UserName = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.tertiary};
  margin-right: 4px;

  ${textMediumStyles}
`

export const UserNameBtn = styled.button`
  padding: 0;
  border: none;
  outline: none;
  position: relative;
  color: ${({ theme }) => theme.tertiary};

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    cursor: default;
    text-decoration: none;
  }
`

export const UserAddress = styled.p`
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.secondary};
  position: relative;
  padding-right: 8px;

  &.chat:after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${({ theme }) => theme.secondary};
  }
`

export const TimeWrapper = styled.div`
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.secondary};
  margin-left: 4px;
`

export const MessageText = styled.div`
  overflow-wrap: anywhere;
  width: 100%;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.primary};
`

export const IconBtn = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: end;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background-color: #bcbdff;
  background-size: contain;
  background-position: center;
  padding: 0;
  outline: none;
  position: relative;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`
