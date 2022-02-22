import React, { createContext, useContext } from "react";

import { useRefBreak } from "../hooks/useRefBreak";

const NarrowContext = createContext<{ narrow: boolean; low: boolean }>({
  narrow: false,
  low: false,
});

export function useNarrow() {
  const { narrow } = useContext(NarrowContext);
  return narrow;
}

export function useLow() {
  const { low } = useContext(NarrowContext);
  return low;
}

interface NarrowProviderProps {
  children: React.ReactNode;
  myRef: React.RefObject<HTMLHeadingElement>;
}

export function NarrowProvider({ children, myRef }: NarrowProviderProps) {
  const narrow = useRefBreak(myRef?.current?.offsetWidth ?? 0, 736);
  const low = useRefBreak(myRef?.current?.offsetHeight ?? 0, 465);
  return <NarrowContext.Provider value={{ narrow, low }} children={children} />;
}
