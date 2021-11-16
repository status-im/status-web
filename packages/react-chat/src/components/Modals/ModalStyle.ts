import styled from "styled-components";

import { textMediumStyles } from "../Text";

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

export const ButtonSection = styled(Section)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;
