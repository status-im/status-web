import { useCallback } from 'react'

import { SiweMessage } from 'siwe'
import { useAccount, useSignMessage } from 'wagmi'

export function useSiwe() {
  const { address, chainId } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const signIn = useCallback(async () => {
    if (!address || !chainId) {
      throw new Error('Wallet not connected')
    }

    // Create SIWE message
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to the app.',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce: await generateNonce(),
    })

    const preparedMessage = message.prepareMessage()

    // Sign the message
    const signature = await signMessageAsync({
      message: preparedMessage,
    })

    // Verify the signature (you would typically do this on the backend)
    // For now, we just return the signature
    return {
      message: preparedMessage,
      signature,
    }
  }, [address, chainId, signMessageAsync])

  return {
    signIn,
  }
}

// Helper function to generate a nonce
async function generateNonce(): Promise<string> {
  const nonce = Math.random().toString(36).substring(2, 15)
  return nonce
}
