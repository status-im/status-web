import React, { ReactNode, useReducer, createContext, useContext } from 'react'
import { CommunityDetail } from '../../models/community'

type CommunitiesDetails = {
  [publicKey: string]: CommunityDetail
}

const CommunitiesContext = createContext<{
  communitiesDetails: CommunitiesDetails
  dispatch: (details: CommunityDetail) => void
}>({
  communitiesDetails: {},
  dispatch: () => undefined,
})

export function useCommunitiesProvider() {
  return useContext(CommunitiesContext)
}

function communitiesReducer(state: CommunitiesDetails, action: CommunityDetail) {
  return { ...state, [action.publicKey]: action }
}

interface CommunitiesProviderProps {
  children: ReactNode
}

export function CommunitiesProvider({ children }: CommunitiesProviderProps) {
  const [communitiesDetails, dispatch] = useReducer(communitiesReducer, {})
  return <CommunitiesContext.Provider value={{ communitiesDetails, dispatch }} children={children} />
}
