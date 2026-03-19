import styled from 'styled-components'
import { Colors } from '../constants/styles'

export const Card = styled.div`
  display: flex;
  align-items: stretch;
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 0;
    padding: 16px 0 32px;
    border-bottom: 1px solid #e0e0e0;
  }

  @media (max-width: 600px) {
    padding-bottom: 16px;
  }

  &:not:first-child {
    @media (max-width: 768px) {
      border-top: 1px solid #e0e0e0;
    }
  }
`

export const CardCommunityWrap = styled.div`
  display: flex;
  align-items: stretch;
  width: 50%;
  margin: 13px 0;
  padding: 24px 24px 16px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px 0px 0px 6px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    border: none;
    box-shadow: none;
    padding-bottom: 0;
  }

  @media (max-width: 600px) {
    padding: 0;
  }
`
export const CardVoteWrap = styled.div`
  display: flex;
  align-items: stretch;
  width: 50%;
  padding: 24px 24px 32px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px 0px 0px 6px;
  background-color: ${Colors.GrayLight};

  @media (max-width: 768px) {
    width: 100%;
    box-shadow: none;
    border-radius: unset;
    background-color: unset;
    padding-bottom: 0;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 16px 0 0;
    border-bottom: none;
  }
`
export const CardVoteBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  background-color: ${Colors.GrayLight};
  position: relative;

  @media (max-width: 768px) {
    background-color: unset;
  }
`

export const CardHeading = styled.h2`
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  text-align: center;

  @media (max-width: 600px) {
    text-align: start;
  }
`
