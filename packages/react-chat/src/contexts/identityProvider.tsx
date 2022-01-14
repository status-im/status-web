import { Identity } from "@waku/status-communities/dist/cjs";
import React, { createContext, useContext, useState } from "react";

const IdentityContext = createContext<{
  identity: Identity | undefined;
  setIdentity: React.Dispatch<React.SetStateAction<Identity | undefined>>;
  walletIdentity: Identity | undefined;
  setWalletIdentity: React.Dispatch<React.SetStateAction<Identity | undefined>>;
  nickname: string | undefined;
  setNickname: React.Dispatch<React.SetStateAction<string | undefined>>;
}>({
  identity: undefined,
  setIdentity: () => undefined,
  walletIdentity: undefined,
  setWalletIdentity: () => undefined,
  nickname: undefined,
  setNickname: () => undefined,
});

export function useIdentity() {
  return useContext(IdentityContext).identity;
}

export function useSetIdentity() {
  return useContext(IdentityContext).setIdentity;
}

export function useWalletIdentity() {
  return useContext(IdentityContext).walletIdentity;
}

export function useSetWalletIdentity() {
  return useContext(IdentityContext).setWalletIdentity;
}

export function useNickname() {
  return useContext(IdentityContext).nickname;
}

export function useSetNikcname() {
  return useContext(IdentityContext).setNickname;
}

interface IdentityProviderProps {
  children: React.ReactNode;
}

export function IdentityProvider({ children }: IdentityProviderProps) {
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [walletIdentity, setWalletIdentity] = useState<Identity | undefined>(
    undefined
  );
  const [nickname, setNickname] = useState<string | undefined>(undefined);

  return (
    <IdentityContext.Provider
      value={{
        identity,
        setIdentity,
        nickname,
        setNickname,
        walletIdentity,
        setWalletIdentity,
      }}
      children={children}
    />
  );
}
