import React, { useEffect, useState } from "react";

export function useRefWidthBreak(
  myRef: React.RefObject<HTMLHeadingElement>,
  sizeThreshold: number
) {
  const [widthBreak, setWidthBreak] = useState(false);

  useEffect(() => {
    const checkDimensions = () => {
      const width = myRef?.current?.offsetWidth ?? 0;
      if (width && width < sizeThreshold && width > 0) {
        if (widthBreak === false) {
          setWidthBreak(true);
        }
      } else {
        if (widthBreak === true) {
          setWidthBreak(false);
        }
      }
    };
    checkDimensions();
    window.addEventListener("resize", checkDimensions);
    return () => {
      window.removeEventListener("resize", checkDimensions);
    };
  }, [myRef, widthBreak, myRef?.current?.offsetWidth]);

  return widthBreak;
}
