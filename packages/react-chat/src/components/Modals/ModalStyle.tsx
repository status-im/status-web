import styled from "styled-components";

import { buttonStyles } from "../Buttons/buttonStyle";
import { textMediumStyles } from "../Text";

export const Section = styled.div`
  padding: 16px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.border};
  }
`;

export const MiddleSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Heading = styled.p`
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
`;

export const Text = styled.p`
  color: ${({ theme }) => theme.primary};

  ${textMediumStyles}
`;

export const Btn = styled.button`
  padding: 11px 24px;
  margin-left: 8px;
  ${buttonStyles}

  &:disabled {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.secondary};
  }
`;

export const BackBtn = styled(Btn)`
  position: absolute;
  left: 16px;
  top: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 8px;
  margin-left: 0;

  & > svg {
    fill: ${({ theme }) => theme.tertiary};
  }
`;

export const ButtonSection = styled(Section)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

export const Hint = styled.p`
  color: ${({ theme }) => theme.secondary};
  font-size: 12px;
  line-height: 16px;
`;

export const AddWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.tertiary};
  border-radius: 50%;
`;

export const QRWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  box-sizing: border-box;
  border-radius: 8px;
  margin: 16px 0;
  padding: 14px;
`;
