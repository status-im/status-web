import React, { ReactNode, useEffect } from 'react'
import styled from 'styled-components'
import { Colors } from '../constants/styles'
import closeIcon from '../assets/images/close.svg'
import refreshIcon from '../assets/images/refresh.svg'

type ModalProps = {
  heading?: string
  children: ReactNode
  setShowModal: (val: boolean) => void
}

export function Modal({ heading, children, setShowModal }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])
  return (
    <PopUpOverlay onClick={() => setShowModal(false)}>
      <PopUpWindow onClick={(e) => e.stopPropagation()}>
        <PopUpHeader>
          {heading ? <PopUpHeading>{heading}</PopUpHeading> : ''}
          <CloseButton onClick={() => setShowModal(false)} />
        </PopUpHeader>
        <PopUpContetnt>{children}</PopUpContetnt>
      </PopUpWindow>
    </PopUpOverlay>
  )
}

const PopUpOverlay = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  transition: all 0.3s;
  overflow: auto;

  @media (max-width: 600px) {
    background-color: #898989;
  }
`

const PopUpWindow = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 475px;
  margin: 20vh auto 2vh;
  padding: 24px;
  margin-bottom: 100px;
  background-color: ${Colors.GrayLight};
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 6px;

  @media (max-width: 600px) {
    max-width: 320px;
    padding: 16px;
  }

  @media (max-width: 375px) {
    margin: 20vh 32px 2vh;
  }
`
const PopUpHeader = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    justify-content: center;
  }
`
const PopUpHeading = styled.p`
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
`
const PopUpContetnt = styled.div`
  width: 100%;
`

export const CloseButton = styled.button`
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-image: url(${closeIcon});
`

export const RetryButton = styled.button`
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-image: url(${refreshIcon});
`
