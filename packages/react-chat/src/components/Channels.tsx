import React from 'react';
import styled from 'styled-components';
import { Theme } from '../styles/themes';

interface ChannelsProps {
  theme: Theme;
}

export function Channels({ theme }: ChannelsProps) {
  return <ChannelsWrapper theme={theme}>Channels</ChannelsWrapper>;
}

const ChannelsWrapper = styled.div<ChannelsProps>`
  width: 33%;
  height: 100%;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
`;
