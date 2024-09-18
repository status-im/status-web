'use client'

import { createContext, useContext } from 'react'

type ConfigType = {
  link: React.ElementType
}

const Context = createContext<ConfigType>({
  link: 'a',
})

type Props = {
  children: React.ReactNode
  config: ConfigType
}

export function StatusProvider(props: Props) {
  return (
    <Context.Provider value={props.config}>{props.children}</Context.Provider>
  )
}

export const useConfig = () => {
  return useContext(Context)
}
