import React from "react";
import styled from "styled-components";

import { paste } from "../../utils/paste";

import {
  ButtonWrapper,
  InputBtn,
  inputStyles,
  Label,
  Wrapper,
} from "./inputStyles";

interface PasteInputProps {
  label: string;
}

export const pasteInput = ({ label }: PasteInputProps) => (
  <div>
    <Label>{label}</Label>
    <Wrapper>
      <Input id="pasteInput" type="text" placeholder="eg. 0x2Ef19" />
      <ButtonWrapper>
        <InputBtn onClick={() => paste()}>Paste</InputBtn>
      </ButtonWrapper>
    </Wrapper>
  </div>
);

const Input = styled.input`
  ${inputStyles}

  border: none;
`;
