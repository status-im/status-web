import React from "react";

import { copy } from "../../utils/copy";
import { reduceString } from "../../utils/reduceString";

import { ButtonWrapper, InputBtn, Label, Text, Wrapper } from "./inputStyles";

interface CopyInputProps {
  label: string;
  value: string;
}

export const CopyInput = ({ label, value }: CopyInputProps) => (
  <div>
    <Label>{label}</Label>
    <Wrapper>
      <Text>{reduceString(value, 15, 15)}</Text>
      <ButtonWrapper>
        <InputBtn onClick={() => copy(value)}>Copy</InputBtn>
      </ButtonWrapper>
    </Wrapper>
  </div>
);
