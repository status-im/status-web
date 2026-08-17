import { ProviderRpcError } from '@status-im/ethereum-provider'

export async function eth_sendTransaction(): Promise<never> {
  throw new ProviderRpcError({
    code: 4200,
    message: 'Not yet supported via dApp connection',
  })
}
