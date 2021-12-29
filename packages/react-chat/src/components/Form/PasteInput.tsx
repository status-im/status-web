import React from "react";
import styled from "styled-components";

import { paste } from "../../utils/paste";

import {
  ButtonWrapper,
  InputBtn,
  inputStyles,
  InputWrapper,
  Label,
  Wrapper,
} from "./inputStyles";

interface PasteInputProps {
  label: string;
}

export const PasteInput = ({ label }: PasteInputProps) => (
  <InputWrapper>
    <Label>{label}</Label>
    <Wrapper>
      <Input id="pasteInput" type="text" placeholder="eg. 0x2Ef19" />
      <ButtonWrapper>
        <InputBtn onClick={() => paste("pasteInput")}>Paste</InputBtn>
      </ButtonWrapper>
    </Wrapper>
  </InputWrapper>
);

const Input = styled.input`
  ${inputStyles}
  width: 100%;

  &:focus {
    outline: none;
  }

  border: none;
`;
