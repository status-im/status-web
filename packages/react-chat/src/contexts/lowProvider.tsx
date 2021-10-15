import React, { createContext, useContext } from "react";

import { useRefHeightBreak } from "../hooks/useRefHeightBreak";

const HeightContext = createContext<boolean>(false);

export function useLow() {
  return useContext(HeightContext);
}

interface LowProviderProps {
  children: React.ReactNode;
  myRef: React.RefObject<HTMLHeadingElement>;
}

export function LowProvider({ children, myRef }: LowProviderProps) {
  const low = useRefHeightBreak(myRef, 465);
  return <HeightContext.Provider value={low} children={children} />;
}
