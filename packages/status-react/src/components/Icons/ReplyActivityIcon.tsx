import React from 'react'

import styled from 'styled-components'

export const ReplyIcon = () => (
  <Icon
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5.08946V3.62446C8 3.00346 8.373 2.81246 8.824 3.20246L12.828 6.64746C13.055 6.84246 13.054 7.15746 12.827 7.35146L8.822 10.7975C8.373 11.1855 8 10.9955 8 10.3745V8.99946C5.498 8.99946 4.183 10.8865 3.524 12.5315C3.421 12.7885 3.271 12.7885 3.2 12.5205C3.071 12.0355 3 11.5255 3 10.9995C3 8.02646 5.164 5.56546 8 5.08946Z" />
  </Icon>
)

const Icon = styled.svg`
  fill: ${({ theme }) => theme.secondary};
  flex-shrink: 0;
`
