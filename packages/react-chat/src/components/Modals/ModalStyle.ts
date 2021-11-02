import styled from "styled-components";

import { textMediumStyles, textSmallStyles } from "../Text";

export const Section = styled.div`
  padding: 16px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.border};
  }
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

export const Label = styled.p`
  margin-bottom: 7px;
  font-weight: 500;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary};

  ${textSmallStyles}
`;

export const Hint = styled.p`
  margin-top: 16px;
  color: ${({ theme }) => theme.secondary};

  ${textSmallStyles}
`;
