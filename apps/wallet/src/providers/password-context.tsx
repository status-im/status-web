import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { PasswordModal } from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'

import { apiClient } from './api-client'
import { useWallet } from './wallet-context'

const SESSION_STATUS_REFETCH_MS = 10_000

export type PasswordModalOptions = {
  title?: string
  description?: string
  buttonLabel?: string
  requireFreshPassword?: boolean
}

export type PasswordContext = {
  hasActiveSession: boolean
  clearSession: () => void
  requestPassword: (options?: PasswordModalOptions) => Promise<string | null>
}

const PasswordContext = createContext<PasswordContext | undefined>(undefined)

export function usePassword() {
  const context = useContext(PasswordContext)
  if (!context) {
    throw new Error('usePassword must be used within PasswordProvider')
  }
  return context
}

export function PasswordProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOptions, setModalOptions] = useState<
    PasswordModalOptions | undefined
  >()
  const [isVerifying, setIsVerifying] = useState(false)
  const passwordResolveRef = useRef<((password: string | null) => void) | null>(
    null,
  )
  const walletIdRef = useRef<string | undefined>(undefined)
  const isModalOpenRef = useRef(false)
  const { currentWallet } = useWallet()

  const { data: sessionStatus } = useQuery({
    queryKey: ['session', 'status'],
    queryFn: () => apiClient.session.status.query(),
    refetchInterval: SESSION_STATUS_REFETCH_MS,
  })
  const hasActiveSession = sessionStatus?.isUnlocked ?? false

  const clearSession = useCallback(() => {
    void apiClient.session.lock.mutate()
  }, [])

  const cancelPendingModal = useCallback(() => {
    if (isModalOpenRef.current && passwordResolveRef.current) {
      passwordResolveRef.current(null)
      passwordResolveRef.current = null
    }
  }, [])

  const requestPassword = useCallback(
    async (options?: PasswordModalOptions): Promise<string | null> => {
      if (options?.requireFreshPassword) {
        cancelPendingModal()

        return new Promise<string | null>(resolve => {
          passwordResolveRef.current = resolve
          walletIdRef.current = currentWallet?.id
          setModalOptions(options)
          setIsModalOpen(true)
          isModalOpenRef.current = true
        })
      }

      if (hasActiveSession) {
        return 'unlocked'
      }

      cancelPendingModal()

      return new Promise<string | null>(resolve => {
        passwordResolveRef.current = resolve
        walletIdRef.current = currentWallet?.id
        setModalOptions(options)
        setIsModalOpen(true)
        isModalOpenRef.current = true
      })
    },
    [hasActiveSession, currentWallet?.id, cancelPendingModal],
  )

  const handlePasswordConfirm = useCallback(
    async (password: string): Promise<void> => {
      const walletId = currentWallet?.id
      if (!walletId) {
        setIsModalOpen(false)
        isModalOpenRef.current = false
        if (passwordResolveRef.current) {
          passwordResolveRef.current(null)
          passwordResolveRef.current = null
        }
        throw new Error('No wallet available')
      }

      if (walletId !== walletIdRef.current) {
        setIsModalOpen(false)
        isModalOpenRef.current = false
        if (passwordResolveRef.current) {
          passwordResolveRef.current(null)
          passwordResolveRef.current = null
        }
        throw new Error('Wallet changed during password request')
      }

      setIsVerifying(true)
      try {
        await apiClient.session.unlock.mutate({ password })
        setIsModalOpen(false)
        isModalOpenRef.current = false
        if (passwordResolveRef.current) {
          passwordResolveRef.current('unlocked')
          passwordResolveRef.current = null
        }
      } finally {
        setIsVerifying(false)
      }
    },
    [currentWallet?.id],
  )

  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open)
    isModalOpenRef.current = open
    if (!open && passwordResolveRef.current) {
      passwordResolveRef.current(null)
      passwordResolveRef.current = null
      walletIdRef.current = undefined
    }
  }, [])

  useEffect(() => {
    return () => {
      if (passwordResolveRef.current) {
        passwordResolveRef.current(null)
        passwordResolveRef.current = null
      }
    }
  }, [])

  const value: PasswordContext = useMemo(
    () => ({
      hasActiveSession,
      clearSession,
      requestPassword,
    }),
    [hasActiveSession, clearSession, requestPassword],
  )

  return (
    <PasswordContext.Provider value={value}>
      {children}
      <PasswordModal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        onConfirm={handlePasswordConfirm}
        isLoading={isVerifying}
        title={modalOptions?.title}
        description={modalOptions?.description}
        buttonLabel={modalOptions?.buttonLabel}
      />
    </PasswordContext.Provider>
  )
}
