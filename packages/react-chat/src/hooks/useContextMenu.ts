import { useCallback, useEffect, useState } from "react";

export const useContextMenu = (elementId: string) => {
  const [showMenu, setShowMenu] = useState(false);
  const element = document.getElementById(elementId) || document;

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
    element.addEventListener("click", handleClick);
    element.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", () => setShowMenu(false));
    return () => {
      element.removeEventListener("click", handleClick);
      element.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", () => setShowMenu(false));
    };
  });

  return { showMenu, setShowMenu };
};
