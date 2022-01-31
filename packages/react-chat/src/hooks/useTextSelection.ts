import { RefObject, useCallback, useLayoutEffect, useState } from "react";

export function useTextSelection(ref: RefObject<HTMLDivElement>) {
  const [topPosition, setTopPosition] = useState(0);
  const [leftPosition, setLeftPosition] = useState(0);
  const [selectedText, setSelectedText] = useState("");

  const handleSelect = useCallback(() => {
    const selection = document.getSelection();
    if (selection !== null) {
      const text = selection.toString();
      if (text !== "" && ref.current) {
        const range = selection.getRangeAt(0);
        const refRect = ref.current.getBoundingClientRect();
        const rect = range.getBoundingClientRect();
        const x = rect.left - refRect.left + rect.width / 2;
        const y = rect.top - refRect.top - 48;

        setSelectedText(text);
        setLeftPosition(x);
        setTopPosition(y);
      }
    }
  }, [setTopPosition, setLeftPosition, setSelectedText]);

  useLayoutEffect(() => {
    document.addEventListener("selectionchange", handleSelect);

    return () => {
      document.removeEventListener("selectionchange", handleSelect);
    };
  });

  return {
    topPosition,
    leftPosition,
    selectedText,
    setSelectedText,
  };
}
