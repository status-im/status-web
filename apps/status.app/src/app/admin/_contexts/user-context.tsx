'use client'

import { createContext, useContext } from 'react'

import type { ApiOutput } from '~server/api/types'

type UserContextType = ApiOutput['user']

const UserContext = createContext<UserContextType | undefined>(undefined)
const useUserContext = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }

  return context
}

type Props = {
  user: ApiOutput['user']
  children: React.ReactNode
}

const UserProvider = ({ user, children }: Props) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export { UserProvider, useUserContext }
