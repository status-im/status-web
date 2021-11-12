import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ModalsState = {
  [name: string]: boolean;
};

type ModalContextType = [
  state: ModalsState,
  setState: React.Dispatch<React.SetStateAction<ModalsState>>
];

const ModalContext = createContext<ModalContextType>([{}, () => undefined]);

export function useModal(name: string) {
  const [modals, setModals] = useContext(ModalContext);
  const setModal = useCallback(
    (state: boolean) => {
      setModals((prev) => {
        return {
          ...prev,
          [name]: state,
        };
      });
    },
    [name, modals]
  );
  const isVisible = useMemo(() => modals?.[name] ?? false, [modals, name]);
  return { isVisible, setModal };
}

interface IdentityProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: IdentityProviderProps) {
  const modalState = useState<ModalsState>({});
  return <ModalContext.Provider value={modalState} children={children} />;
}
