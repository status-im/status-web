import React from "react";
import styled from "styled-components";

import { Theme } from "../styles/themes";

interface MembersProps {
  theme: Theme;
}

export function Members({ theme }: MembersProps) {
  return <MembersWrapper theme={theme}>Members</MembersWrapper>;
}

const MembersWrapper = styled.div<MembersProps>`
  width: 18%;
  height: 100%;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
`;
