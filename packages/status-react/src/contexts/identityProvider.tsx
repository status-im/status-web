import { Identity, bufToHex } from '@status-im/core'
import React, { createContext, useContext, useMemo, useState } from 'react'

const IdentityContext = createContext<{
  identity: Identity | undefined
  setIdentity: React.Dispatch<React.SetStateAction<Identity | undefined>>
  publicKey: string | undefined
  walletIdentity: Identity | undefined
  setWalletIdentity: React.Dispatch<React.SetStateAction<Identity | undefined>>
  nickname: string | undefined
  setNickname: React.Dispatch<React.SetStateAction<string | undefined>>
}>({
  identity: undefined,
  setIdentity: () => undefined,
  publicKey: undefined,
  walletIdentity: undefined,
  setWalletIdentity: () => undefined,
  nickname: undefined,
  setNickname: () => undefined,
})

export function useIdentity() {
  return useContext(IdentityContext).identity
}

export function useUserPublicKey() {
  return useContext(IdentityContext).publicKey
}

export function useSetIdentity() {
  return useContext(IdentityContext).setIdentity
}

export function useWalletIdentity() {
  return useContext(IdentityContext).walletIdentity
}

export function useSetWalletIdentity() {
  return useContext(IdentityContext).setWalletIdentity
}

export function useNickname() {
  return useContext(IdentityContext).nickname
}

export function useSetNikcname() {
  return useContext(IdentityContext).setNickname
}

interface IdentityProviderProps {
  children: React.ReactNode
}

export function IdentityProvider({ children }: IdentityProviderProps) {
  const [identity, setIdentity] = useState<Identity | undefined>(undefined)
  const publicKey = useMemo(
    () => (identity ? bufToHex(identity.publicKey) : undefined),
    [identity]
  )
  const [walletIdentity, setWalletIdentity] = useState<Identity | undefined>(
    undefined
  )
  const [nickname, setNickname] = useState<string | undefined>(undefined)

  return (
    <IdentityContext.Provider
      value={{
        identity,
        setIdentity,
        publicKey,
        nickname,
        setNickname,
        walletIdentity,
        setWalletIdentity,
      }}
    >
      {children}
    </IdentityContext.Provider>
  )
}
