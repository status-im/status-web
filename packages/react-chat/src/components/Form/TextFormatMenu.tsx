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
  selectedElement: {
    element: Selection | null;
    start: number;
    end: number;
    text: string;
    node: Node | null;
  };
};

export function TextFormatMenu({
  textRef,
  selectedElement,
}: TextFormatMenuProps) {
  const identity = useIdentity();
  const { topPosition, leftPosition, selectedText, setSelectedText } =
    useTextSelection(textRef);

  const menuStyle = {
    top: topPosition,
    left: leftPosition,
  };

  const ref = useRef(null);
  useClickOutside(ref, () => setSelectedText(""));

  const addStyle = (tag: string) => {
    const { element, text, node } = selectedElement;
    const styledElement = document.createElement(tag);
    if (tag === "span") styledElement.style.textDecoration = "line-through";
    if (tag === "pre")
      styledElement.style.fontFamily = "Roboto Mono, monospace";
    styledElement.innerText = selectedText;

    if (element && text && node && styledElement && element.rangeCount > 0) {
      const range = element.getRangeAt(0);
      range.deleteContents();
      range.insertNode(styledElement);
      range.collapse();
    }
  };

  if (identity && selectedText) {
    return (
      <Wrapper style={menuStyle} ref={ref}>
        <MenuBtn onClick={() => addStyle("b")}>
          <TextBoldIcon />
          <Tooltip tip="Bold" />
        </MenuBtn>
        <MenuBtn onClick={() => addStyle("i")}>
          <TextItalicIcon />
          <Tooltip tip="Italic" />
        </MenuBtn>
        <MenuBtn onClick={() => addStyle("span")}>
          <TextStrikethroughIcon />
          <Tooltip tip="Strikethrough" />
        </MenuBtn>
        <MenuBtn onClick={() => addStyle("pre")}>
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
