import { useProtocol } from './provider'

export const useAccount = () => {
  const { client, account, dispatch } = useProtocol()

  const createAccount = () => {
    const account = client.createAccount()
    dispatch({ type: 'SET_ACCOUNT', account })
    // TODO: save account

    return account
  }

  const deleteAccount = () => {
    dispatch({ type: 'REMOVE_ACCOUNT' })
    // TODO: remove from storage
  }

  return { account, createAccount, deleteAccount } as const
}
