import styled, { css } from 'styled-components'

export const buttonStyles = css`
  font-family: 'Inter';
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  border-radius: 8px;
  color: ${({ theme }) => theme.tertiary};
  background: ${({ theme }) => theme.buttonBg};

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }

  &:focus {
    background: ${({ theme }) => theme.buttonBg};
  }
`

export const buttonTransparentStyles = css`
  font-family: 'Inter';
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  text-align: center;
  color: ${({ theme }) => theme.tertiary};
  background: inherit;
  padding: 10px 12px;
  border-radius: 8px;

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }

  &:focus {
    background: ${({ theme }) => theme.buttonBg};
  }
`

export const ButtonNo = styled.button`
  padding: 11px 24px;
  margin-right: 16px;

  ${buttonStyles}
  background: ${({ theme }) => theme.buttonNoBg};
  color: ${({ theme }) => theme.redColor};

  &:hover {
    background: ${({ theme }) => theme.buttonNoBgHover};
  }
`

export const ButtonYes = styled.button`
  padding: 11px 24px;

  ${buttonStyles}
`
