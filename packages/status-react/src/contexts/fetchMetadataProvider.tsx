import React, { createContext, useContext } from 'react'

type Metadata = Record<string, string>

const FetchMetadataContext = createContext<
  ((link: string) => Promise<Metadata>) | undefined
>(undefined)

export function useFetchMetadata() {
  return useContext(FetchMetadataContext)
}

interface FetchMetadataProviderProps {
  children: React.ReactNode
  fetchMetadata?: (link: string) => Promise<Metadata>
}

export function FetchMetadataProvider({
  children,
  fetchMetadata,
}: FetchMetadataProviderProps) {
  return (
    <FetchMetadataContext.Provider value={fetchMetadata}>
      {children}
    </FetchMetadataContext.Provider>
  )
}
