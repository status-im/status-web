import { css } from "styled-components";

export const buttonStyles = css`
  border-radius: 8px;
  font-family: "Inter";
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  color: ${({ theme }) => theme.tertiary};
  background: ${({ theme }) => theme.buttonBg};
`;
