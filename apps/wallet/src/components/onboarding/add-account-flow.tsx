import { useEffect, useRef, useState } from 'react'

import { Button, Input, Text } from '@status-im/components'
import { useNavigate } from '@tanstack/react-router'

import { useAddAccount } from '@/hooks/use-add-account'
import { usePreviewWalletAccount } from '@/hooks/use-preview-wallet-account'
import { useWalletFlowSuccess } from '@/hooks/use-wallet-flow-success'
import { usePassword } from '@/providers/password-context'
import { useWallet } from '@/providers/wallet-context'

import { BackButton } from './back-button'

const DERIVATION_PATH_REGEX = /^m(\/\d+'?)+$/
const PREVIEW_DEBOUNCE_MS = 400

type AccountPreview = {
  address: string
  derivationPath: string
  active: boolean
  alreadyImported: boolean
}

type Props = {
  backHref: string
  successHref: string
}

export function AddAccountFlow({ backHref, successHref }: Props) {
  const navigate = useNavigate()
  const { currentWallet } = useWallet()
  const { requestPassword } = usePassword()
  const { previewWalletAccountAsync } = usePreviewWalletAccount()
  const { addAccountAsync } = useAddAccount()
  const onSuccess = useWalletFlowSuccess(successHref)

  // null until the initial preview prefills the next sequential path
  const [path, setPath] = useState<string | null>(null)
  const [pathError, setPathError] = useState<string | null>(null)
  const [preview, setPreview] = useState<AccountPreview | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const walletId = currentWallet?.id
  const canDerive = currentWallet?.type === 'mnemonic'

  // Preview results are tracked in local state via mutateAsync instead of the
  // mutation hook's state: mutations observed from a mount effect hang forever
  // under StrictMode (see the note in import-wallet-flow.tsx).
  const previewSeq = useRef(0)
  const runPreview = async (derivationPath?: string) => {
    if (!walletId) return
    const seq = ++previewSeq.current
    setIsPreviewing(true)
    try {
      const result = await previewWalletAccountAsync({
        walletId,
        derivationPath,
      })
      if (seq !== previewSeq.current) return
      setPreview(result)
      if (derivationPath === undefined) setPath(result.derivationPath)
    } catch (error) {
      if (seq !== previewSeq.current) return
      console.error('failed to preview account', error)
      setPreview(null)
      setPathError('Unable to derive an address for this path')
    } finally {
      if (seq === previewSeq.current) setIsPreviewing(false)
    }
  }
  const runPreviewRef = useRef(runPreview)
  runPreviewRef.current = runPreview

  useEffect(() => {
    if (!currentWallet || !canDerive) {
      navigate({ to: backHref })
    }
  }, [backHref, canDerive, currentWallet, navigate])

  // Unlock the session, then prefill with the next sequential path. Ref-guarded
  // so StrictMode's double effect doesn't cancel its own password modal.
  const hasInitialized = useRef(false)
  useEffect(() => {
    if (!walletId || !canDerive || hasInitialized.current) return
    hasInitialized.current = true

    const initialize = async () => {
      const isUnlocked = await requestPassword({
        title: 'Enter password',
        description: 'To create a new account',
      })
      if (!isUnlocked) {
        navigate({ to: backHref })
        return
      }
      await runPreviewRef.current()
    }

    initialize().catch(error => console.error(error))
  }, [backHref, canDerive, navigate, requestPassword, walletId])

  // Re-preview (debounced) when the user edits the path.
  useEffect(() => {
    if (path === null) return
    const derivationPath = path.trim()

    if (!DERIVATION_PATH_REGEX.test(derivationPath)) {
      previewSeq.current++
      setIsPreviewing(false)
      setPreview(null)
      setPathError("Enter a valid derivation path, e.g. m/44'/60'/0'/0/1")
      return
    }
    setPathError(null)
    if (preview?.derivationPath === derivationPath) return

    const timeout = setTimeout(() => {
      void runPreviewRef.current(derivationPath)
    }, PREVIEW_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  if (!currentWallet || !canDerive) {
    return null
  }

  const handleCreate = async () => {
    if (!walletId || path === null) return
    setIsCreating(true)
    setSubmitError(null)
    try {
      await addAccountAsync({
        walletId,
        derivationPath: path.trim(),
      })
      await onSuccess(
        { id: currentWallet.id, name: currentWallet.name },
        'Account created',
      )
    } catch (error) {
      console.error('failed to create account', error)
      setSubmitError(
        error instanceof Error &&
          error.message.includes('ACCOUNT_ALREADY_EXISTS')
          ? 'This account is already imported'
          : 'Unable to create the account. Please try again.',
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handlePathChange = (value: string) => {
    setPath(value)
    setSubmitError(null)
  }

  const isDuplicate = preview?.alreadyImported === true
  const canCreate =
    path !== null &&
    !isPreviewing &&
    !isCreating &&
    !pathError &&
    preview !== null &&
    !isDuplicate

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center pb-4">
        <BackButton href={backHref} />
      </div>
      <Text size={27} weight="semibold">
        Create account
      </Text>
      <Text size={15} color="$neutral-50" className="mb-4">
        Derive a new account from the recovery phrase of {currentWallet.name}.
        Use the suggested derivation path or enter a custom one.
      </Text>

      <div className="mb-4 flex flex-col gap-2">
        <Input
          label="Derivation path"
          value={path ?? ''}
          onChange={handlePathChange}
          placeholder="m/44'/60'/0'/0/1"
          isDisabled={path === null}
        />
        {pathError && <p className="text-13 text-danger-50">{pathError}</p>}
      </div>

      {path === null || isPreviewing ? (
        <Text size={13} color="$neutral-50" className="mb-4">
          Deriving address…
        </Text>
      ) : (
        preview && (
          <div className="mb-4 flex items-center justify-between gap-2 rounded-12 border border-neutral-10 bg-neutral-2.5 p-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <Text size={13} color="$neutral-50">
                {preview.derivationPath} ·{' '}
                {preview.active ? 'Active' : 'No activity'}
              </Text>
              <Text size={13} weight="medium" className="break-all">
                {preview.address}
              </Text>
            </div>
          </div>
        )
      )}

      {isDuplicate && (
        <p className="mb-4 text-13 text-danger-50">
          This account is already imported
        </p>
      )}
      {submitError && (
        <p className="mb-4 text-13 text-danger-50">{submitError}</p>
      )}

      <div className="mt-auto">
        <Button onClick={handleCreate} disabled={!canCreate}>
          {isCreating ? 'Creating…' : 'Create account'}
        </Button>
      </div>
    </div>
  )
}
