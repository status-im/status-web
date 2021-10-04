import React, { createContext, useContext } from "react";

import { useRefWidthBreak } from "../hooks/useRefWidthBreak";

const NarrowContext = createContext<boolean>(false);

export function useNarrow() {
  return useContext(NarrowContext);
}

interface NarrowProviderProps {
  children: React.ReactNode;
  myRef: React.RefObject<HTMLHeadingElement>;
}

export function NarrowProvider({ children, myRef }: NarrowProviderProps) {
  const narrow = useRefWidthBreak(myRef, 736);
  return <NarrowContext.Provider value={narrow} children={children} />;
}
