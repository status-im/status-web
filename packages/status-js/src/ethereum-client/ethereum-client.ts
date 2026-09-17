import { Point } from 'ethereum-cryptography/secp256k1'
import { ethers } from 'ethers'

import { publicKeyToETHAddress } from '../utils/public-key-to-eth-address'

export class EthereumClient {
  #provider: ethers.JsonRpcApiProvider

  constructor(url: string, chainId: number) {
    // Without a static network ethers retries `eth_chainId` forever and never
    // dispatches queued requests, so a rejected RPC would hang every call.
    this.#provider = new ethers.JsonRpcProvider(url, chainId, {
      staticNetwork: true,
    })
  }

  stop() {
    this.#provider.destroy()
  }

  async resolvePublicKey(
    ensName: string,
    options: { compress: boolean },
  ): Promise<string | undefined> {
    try {
      const resolver = await this.#provider.getResolver(ensName)

      if (!resolver) {
        return
      }

      const address = resolver.address
      const abi = [
        'function pubkey(bytes32 node) view returns (bytes32 x, bytes32 y)',
      ]

      const resolverContract = new ethers.Contract(address, abi, this.#provider)

      const node = ethers.namehash(ensName)
      const [x, y] = await resolverContract.pubkey(node)

      const px = BigInt(x)
      const py = BigInt(y)

      const point = new Point(px, py)
      point.assertValidity()

      const hex = point.toHex(options.compress)

      return `0x${hex}`
    } catch {
      return
    }
  }

  /**
   * Resolves to undefined when the registry has no entry for the community.
   * Rejects on RPC failure so callers can tell "no owner" from "unknown".
   */
  async resolveOwner(
    registryContractAddress: string,
    communityPublicKey: string,
  ): Promise<string | undefined> {
    const registryContract = new ethers.Contract(
      registryContractAddress,
      ['function getEntry(address _communityAddress) view returns (address)'],
      this.#provider,
    )
    const ownerContractAddress: string = await registryContract.getEntry(
      publicKeyToETHAddress(communityPublicKey),
    )

    if (ownerContractAddress === ethers.ZeroAddress) {
      return
    }

    const ownerContract = new ethers.Contract(
      ownerContractAddress,
      ['function signerPublicKey() view returns (bytes)'],
      this.#provider,
    )

    return ownerContract.signerPublicKey()
  }
}
