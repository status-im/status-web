import React from "react";
import styled from "styled-components";

import { Theme } from "../../styles/themes";
import { copy } from "../../utils/copy";
import { reduceString } from "../../utils/reduceString";
import { textMediumStyles, textSmallStyles } from "../Text";

interface CopyInputProps {
  label: string;
  value: string;
  theme: Theme;
}

export const CopyInput = ({ label, value, theme }: CopyInputProps) => (
  <div>
    <Label theme={theme}>{label}</Label>
    <Wrapper theme={theme}>
      <Text theme={theme}>{reduceString(value, 15, 15)}</Text>
      <CopyButtonWrapper>
        <CopyButton theme={theme} onClick={() => copy(value)}>
          Copy
        </CopyButton>
      </CopyButtonWrapper>
    </Wrapper>
  </div>
);

const Label = styled.p`
  margin-bottom: 7px;
  font-weight: 500;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary};

  ${textSmallStyles}
`;

const Wrapper = styled.div`
  position: relative;
  padding: 14px 70px 14px 8px;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 8px;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.primary};

  ${textMediumStyles}
`;

const CopyButtonWrapper = styled.div`
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
`;

const CopyButton = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${({ theme }) => theme.tertiary};
  background: ${({ theme }) => theme.buttonBg};
  border: 1px solid ${({ theme }) => theme.tertiary};
  border-radius: 6px;
`;
