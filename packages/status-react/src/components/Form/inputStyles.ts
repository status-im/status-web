import styled, { css } from 'styled-components'

import { textMediumStyles, textSmallStyles } from '../Text'

export const inputStyles = css`
  background: ${({ theme }) => theme.inputColor};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.inputColor};
  color: ${({ theme }) => theme.primary};
  outline: none;

  ${textMediumStyles}

  &:focus {
    outline: 1px solid ${({ theme }) => theme.tertiary};
    caret-color: ${({ theme }) => theme.notificationColor};
  }
`

export const Label = styled.p`
  margin-bottom: 7px;
  font-weight: 500;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary};

  ${textSmallStyles}
`

export const InputWrapper = styled.div`
  width: 100%;
`

export const Wrapper = styled.div`
  position: relative;
  padding: 14px 70px 14px 8px;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 8px;
`

export const Text = styled.p`
  color: ${({ theme }) => theme.primary};

  ${textMediumStyles}
`

export const ButtonWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 70px;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.inputColor};
  border-radius: 8px;
`

export const InputBtn = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${({ theme }) => theme.tertiary};
  background: ${({ theme }) => theme.buttonBg};
  border: 1px solid ${({ theme }) => theme.tertiary};
  border-radius: 6px;
`

export const NameInputWrapper = styled.div`
  position: relative;
`

export const NameInput = styled.input`
  width: 328px;
  padding: 11px 16px;

  ${inputStyles}
`

export const ClearBtn = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;

  & > svg {
    fill: ${({ theme }) => theme.secondary};
  }
`
