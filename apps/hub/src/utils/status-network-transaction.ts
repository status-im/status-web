import { estimateGas } from 'viem/linea'
import { simulateContract, writeContract } from 'wagmi/actions'

import { statusHoodi } from '~constants/chain'

import type { Account, Chain, Client, Transport } from 'viem'
import type { Config } from 'wagmi'

/**
 * Prepares and executes a contract write for Status Network by using
 * linea_estimateGas to set proper gas fields, bypassing RLN restrictions.
 *
 * Based on the bridge UI pattern:
 * @see https://github.com/status-im/status-network-bridge-ui/blob/develop/src/services/statusNetworkTransaction.ts
 */
export async function writeStatusNetworkContract(
  config: Config,
  params: Parameters<typeof simulateContract>[1]
): Promise<`0x${string}`> {
  const simulation = await simulateContract(config, {
    ...params,
    chainId: statusHoodi.id,
  })

  try {
    const client = config.getClient({ chainId: statusHoodi.id }) as Client<
      Transport,
      Chain,
      Account
    >

    const { priorityFeePerGas } = await estimateGas(
      client,
      simulation.request as Parameters<typeof estimateGas>[1]
    )

    simulation.request = {
      ...simulation.request,
      maxFeePerGas: priorityFeePerGas,
      maxPriorityFeePerGas: priorityFeePerGas,
    } as typeof simulation.request
  } catch {
    // If linea_estimateGas fails, proceed without overriding gas fields
  }

  return writeContract(
    config,
    simulation.request as Parameters<typeof writeContract>[1]
  )
}
