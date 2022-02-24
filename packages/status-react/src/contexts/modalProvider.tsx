import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import {
  ProfileModalName,
  ProfileModalProps,
} from '../components/Modals/ProfileModal'

type TypeMap = {
  [ProfileModalName]?: ProfileModalProps
}

type ModalsState = TypeMap & {
  [name: string]: boolean | undefined
}

type ModalContextType = [
  state: ModalsState,
  setState: React.Dispatch<React.SetStateAction<ModalsState>>
]

const ModalContext = createContext<ModalContextType>([{}, () => undefined])

export function useModal<T extends string>(name: T) {
  const [modals, setModals] = useContext(ModalContext)

  const setModal = useCallback(
    (state: T extends keyof TypeMap ? TypeMap[T] | false : boolean) => {
      setModals(prev => {
        if (!state) {
          return {
            ...prev,
            [name]: undefined,
          }
        }
        return {
          ...prev,
          [name]: state,
        }
      })
    },
    [name, setModals]
  )
  const isVisible = useMemo(() => !!modals?.[name], [modals, name])

  const props = useMemo(() => modals?.[name], [modals, name])

  return { isVisible, setModal, props }
}

interface IdentityProviderProps {
  children: React.ReactNode
}

export function ModalProvider({ children }: IdentityProviderProps) {
  const modalState = useState<ModalsState>({})
  return (
    <ModalContext.Provider value={modalState}>{children}</ModalContext.Provider>
  )
}
