import { BaseEmoji } from "emoji-mart";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { useClickOutside } from "../../hooks/useClickOutside";
import { MenuBtn } from "../Buttons/buttonStyle";
import { Tooltip } from "../Form/Tooltip";
import { ReactionSvg } from "../Icons/ReactionIcon";

import { ReactionPicker } from "./ReactionPicker";

interface ReactionButtonProps {
  className?: string;
  messageReactions: BaseEmoji[];
  setMessageReactions: React.Dispatch<React.SetStateAction<BaseEmoji[]>>;
}

export function ReactionButton({
  className,
  messageReactions,
  setMessageReactions,
}: ReactionButtonProps) {
  const ref = useRef(null);
  useClickOutside(ref, () => setShowReactions(false));

  const [showReactions, setShowReactions] = useState(false);

  return (
    <Wrapper ref={ref}>
      {showReactions && (
        <ReactionPicker
          messageReactions={messageReactions}
          setMessageReactions={setMessageReactions}
          className={className}
        />
      )}
      <MenuBtn
        onClick={() => setShowReactions(!showReactions)}
        className={className}
      >
        <ReactionSvg className={className} />
        {!className && !showReactions && <Tooltip tip="Add reaction" />}
      </MenuBtn>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;
