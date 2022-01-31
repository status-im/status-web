import React, { useRef } from "react";
import styled from "styled-components";

import { useIdentity } from "../../contexts/identityProvider";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useTextSelection } from "../../hooks/useTextSelection";
import { MenuBtn } from "../Buttons/buttonStyle";
import { TextBoldIcon } from "../Icons/TextBoldIcon";
import { TextCodeIcon } from "../Icons/TextCodeIcon";
import { TextItalicIcon } from "../Icons/TextItalicIcon";
import { TextStrikethroughIcon } from "../Icons/TextStrikethroughIcon";

import { Tooltip } from "./Tooltip";

type TextFormatMenuProps = {
  textRef: React.MutableRefObject<null>;
};

export function TextFormatMenu({ textRef }: TextFormatMenuProps) {
  const identity = useIdentity();
  const { topPosition, leftPosition, selectedText, setSelectedText } =
    useTextSelection(textRef);

  const menuStyle = {
    top: topPosition,
    left: leftPosition,
  };

  const ref = useRef(null);
  useClickOutside(ref, () => setSelectedText(""));

  if (identity && selectedText) {
    return (
      <Wrapper style={menuStyle} ref={ref}>
        <MenuBtn>
          <TextBoldIcon />
          <Tooltip tip="Bold" />
        </MenuBtn>
        <MenuBtn>
          <TextItalicIcon />
          <Tooltip tip="Italic" />
        </MenuBtn>
        <MenuBtn>
          <TextStrikethroughIcon />
          <Tooltip tip="Strikethrough" />
        </MenuBtn>
        <MenuBtn>
          <TextCodeIcon />
          <Tooltip tip="Code" />
        </MenuBtn>
      </Wrapper>
    );
  } else {
    return null;
  }
}

const Wrapper = styled.div`
  display: flex;
  position: absolute;
  box-shadow: 0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  padding: 2px;
  transform: translateX(-50%);
`;
