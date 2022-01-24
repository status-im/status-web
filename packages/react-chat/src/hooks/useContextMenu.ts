import { useCallback, useEffect, useState } from "react";

export const useContextMenu = (elementId: string) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setShowMenu(true);
    },
    [setShowMenu]
  );

  useEffect(() => {
    const element = document.getElementById(elementId) || document;

    element.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", () => setShowMenu(false));
    return () => {
      element.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", () => setShowMenu(false));
      setShowMenu(false);
    };
  }, [elementId]);

  return { showMenu, setShowMenu };
};
