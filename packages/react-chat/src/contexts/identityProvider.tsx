import React, { createContext, useContext } from "react";
import { Identity } from "status-communities/dist/cjs";

const IdentityContext = createContext(new Identity(new Uint8Array()));

export function useIdentity() {
  return useContext(IdentityContext);
}

interface IdentityProviderProps {
  children: React.ReactNode;
  identity: Identity;
}

export function IdentityProvider({
  children,
  identity,
}: IdentityProviderProps) {
  return <IdentityContext.Provider value={identity} children={children} />;
}
