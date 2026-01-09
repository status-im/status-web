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

import { apiClient } from './api-client'
import { useWallet } from './wallet-context'

const SESSION_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

export type PasswordSession = {
  password: string
  expiresAt: number
  lastActivityAt: number
}

export type PasswordModalOptions = {
  title?: string
  description?: string
  buttonLabel?: string
  requireFreshPassword?: boolean
}

export type PasswordContext = {
  hasActiveSession: boolean
  sessionExpiresAt: number | null
  establishSession: (password: string) => Promise<void>
  getPassword: () => string | null
  clearSession: () => void
  requestPassword: (options?: PasswordModalOptions) => Promise<string | null>
}

const PasswordContext = createContext<PasswordContext | undefined>(undefined)

export function usePasswordSession() {
  const context = useContext(PasswordContext)
  if (!context) {
    throw new Error('usePasswordSession must be used within PasswordProvider')
  }
  return context
}

export function PasswordProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PasswordSession | null>(null)
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

  const hasActiveSession = useMemo(
    () => session !== null && session.expiresAt > Date.now(),
    [session],
  )

  const sessionExpiresAt = useMemo(
    () => session?.expiresAt ?? null,
    [session?.expiresAt],
  )

  const establishSession = useCallback(async (password: string) => {
    if (typeof password !== 'string') {
      throw new Error('Password must be a string')
    }
    const trimmed = password.trim()
    if (!trimmed) {
      throw new Error('Password cannot be empty')
    }
    const now = Date.now()
    const expiresAt = now + SESSION_TIMEOUT_MS

    setSession({
      password: trimmed,
      expiresAt,
      lastActivityAt: now,
    })
  }, [])

  const getPassword = useCallback((): string | null => {
    if (!session) {
      return null
    }
    const now = Date.now()
    if (session.expiresAt <= now) {
      return null
    }
    let currentPassword = session.password
    setSession(prev => {
      if (!prev) {
        return prev
      }
      const currentTime = Date.now()
      if (prev.expiresAt <= currentTime) {
        return prev
      }
      currentPassword = prev.password
      return {
        ...prev,
        lastActivityAt: currentTime,
        expiresAt: currentTime + SESSION_TIMEOUT_MS,
      }
    })
    return currentPassword
  }, [session])

  const clearSession = useCallback(() => {
    setSession(null)
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
        return getPassword()
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
    [hasActiveSession, getPassword, currentWallet?.id, cancelPendingModal],
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
        await apiClient.wallet.get.query({
          walletId,
          password,
        })
        if (!modalOptions?.requireFreshPassword) {
          await establishSession(password)
        }
        setIsModalOpen(false)
        isModalOpenRef.current = false
        if (passwordResolveRef.current) {
          passwordResolveRef.current(password)
          passwordResolveRef.current = null
        }
      } catch (error) {
        if (error instanceof Error) {
          const message = error.message.toLowerCase()
          if (
            message.includes('invalid password') ||
            message.includes('incorrect password') ||
            message.includes('wrong password') ||
            message.includes('authentication failed')
          ) {
            throw new Error('Invalid password')
          }
        }
        throw error
      } finally {
        setIsVerifying(false)
      }
    },
    [currentWallet?.id, establishSession, modalOptions],
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
    if (!session) {
      return
    }
    const now = Date.now()
    if (session.expiresAt <= now) {
      clearSession()
      return
    }
    const timeoutDuration = session.expiresAt - now
    const timeout = setTimeout(() => {
      clearSession()
    }, timeoutDuration)
    return () => clearTimeout(timeout)
  }, [session, clearSession])

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
      sessionExpiresAt,
      establishSession,
      getPassword,
      clearSession,
      requestPassword,
    }),
    [
      hasActiveSession,
      sessionExpiresAt,
      establishSession,
      getPassword,
      clearSession,
      requestPassword,
    ],
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
