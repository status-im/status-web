import { Point } from 'ethereum-cryptography/secp256k1'
import { ethers } from 'ethers'

import { publicKeyToETHAddress } from '../utils/public-key-to-eth-address'

export class EthereumClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #provider: any

  constructor(url: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.#provider = new (ethers as any).providers.JsonRpcProvider(url)
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const node = (ethers as any).utils.namehash(ensName)
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

  async resolveOwner(
    registryContractAddress: string,
    communityPublicKey: string,
  ): Promise<string | undefined> {
    try {
      const registryContract = new ethers.Contract(
        registryContractAddress,
        ['function getEntry(address _communityAddress) view returns (address)'],
        this.#provider,
      )
      const ownerContractAddress = await registryContract.getEntry(
        publicKeyToETHAddress(communityPublicKey),
      )

      const ownerContract = new ethers.Contract(
        ownerContractAddress,
        ['function signerPublicKey() view returns (bytes)'],
        this.#provider,
      )
      const owner = await ownerContract.signerPublicKey()

      return owner
    } catch {
      return
    }
  }
}
