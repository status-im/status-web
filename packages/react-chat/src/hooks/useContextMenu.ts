import { useCallback, useEffect, useState } from "react";

export const useContextMenu = (image: string) => {
  const [showMenu, setShowMenu] = useState(false);
  const imageEl = document.getElementById(image) || document;

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setShowMenu(true);
    },
    [setShowMenu]
  );

  const handleClick = useCallback(
    () => (showMenu ? setShowMenu(false) : null),
    [showMenu]
  );

  useEffect(() => {
    imageEl.addEventListener("click", handleClick);
    imageEl.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", () => setShowMenu(false));
    return () => {
      imageEl.removeEventListener("click", handleClick);
      imageEl.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", () => setShowMenu(false));
    };
  });

  return { showMenu };
};
