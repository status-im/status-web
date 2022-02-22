import React, { createContext, useContext } from 'react'

const FetchMetadataContext = createContext<
  ((link: string) => Promise<any>) | undefined
>(undefined)

export function useFetchMetadata() {
  return useContext(FetchMetadataContext)
}

interface FetchMetadataProviderProps {
  children: React.ReactNode
  fetchMetadata?: (link: string) => Promise<any>
}

export function FetchMetadataProvider({
  children,
  fetchMetadata,
}: FetchMetadataProviderProps) {
  return (
    <FetchMetadataContext.Provider value={fetchMetadata} children={children} />
  )
}
