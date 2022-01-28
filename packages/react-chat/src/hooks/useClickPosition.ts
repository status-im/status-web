import { RefObject, useCallback, useEffect, useState } from "react";

export const useClickPosition = (ref: RefObject<HTMLDivElement>) => {
  const [topPosition, setTopPosition] = useState(0);
  const [leftPosition, setLeftPosition] = useState(0);

  const getPosition = useCallback(
    (e: MouseEvent) => {
      if (ref.current) {
        const target = e.target as HTMLImageElement;
        const imgTarget = target.tagName === "IMG";
        const rect = ref.current.getBoundingClientRect();
        const x = ref.current.clientWidth - e.clientX < 180 ? 180 : 0;
        setLeftPosition(imgTarget ? -200 : e.clientX - rect.left - x);
        setTopPosition(imgTarget ? 0 : e.clientY - rect.top);
      }
    },
    [setTopPosition, setLeftPosition]
  );

  useEffect(() => {
    document.addEventListener("contextmenu", getPosition);

    return () => {
      document.removeEventListener("contextmenu", getPosition);
    };
  });

  return { topPosition, leftPosition };
};
