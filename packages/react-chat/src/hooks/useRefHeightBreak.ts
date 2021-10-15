import React, { useEffect, useState } from "react";

export function useRefHeightBreak(
  myRef: React.RefObject<HTMLHeadingElement>,
  sizeThreshold: number
) {
  const [heightBreak, setHeightBreak] = useState(false);

  useEffect(() => {
    const checkDimensions = () => {
      const width = myRef?.current?.offsetHeight ?? 0;
      if (width && width < sizeThreshold && width > 0) {
        if (heightBreak === false) {
          setHeightBreak(true);
        }
      } else {
        if (heightBreak === true) {
          setHeightBreak(false);
        }
      }
    };
    checkDimensions();
    window.addEventListener("resize", checkDimensions);
    return () => {
      window.removeEventListener("resize", checkDimensions);
    };
  }, [myRef, heightBreak, myRef?.current?.offsetHeight]);

  return heightBreak;
}
