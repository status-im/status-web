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

  const hideMenu = useCallback(() => setShowMenu(false), []);

  useEffect(() => {
    if (showMenu === true) {
      element.addEventListener("contextmenu", handleContextMenu);
    } else {
      document.addEventListener("click", hideMenu);
    }
    return () => {
      if (showMenu === true) {
        element.removeEventListener("contextmenu", handleContextMenu);
      } else {
        document.removeEventListener("click", hideMenu);
      }
    };
  }, [showMenu]);

  return { showMenu, setShowMenu };
};
