import { Picker } from "emoji-mart";
import React from "react";
import { useTheme } from "styled-components";

import { useLow } from "../../contexts/narrowProvider";
import { lightTheme, Theme } from "../../styles/themes";

type EmojiPickerProps = {
  showEmoji: boolean;
  addEmoji: (e: any) => void;
};

export function EmojiPicker({ showEmoji, addEmoji }: EmojiPickerProps) {
  const theme = useTheme() as Theme;
  const low = useLow();

  if (showEmoji) {
    return (
      <Picker
        onSelect={addEmoji}
        theme={theme === lightTheme ? "light" : "dark"}
        set="twitter"
        color={theme.tertiary}
        emojiSize={26}
        style={{
          color: theme.secondary,
          height: low ? "200px" : "355px",
          overflow: "auto",
        }}
        showPreview={false}
        showSkinTones={false}
        title={""}
      />
    );
  }
  return null;
}
