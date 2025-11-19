import { Point } from 'ethereum-cryptography/secp256k1'
import { ethers } from 'ethers'

import { publicKeyToETHAddress } from '../utils/public-key-to-eth-address'

export class EthereumClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #provider: any

  constructor(url: string) {
    // Use bracket notation to prevent webpack from statically analyzing the export
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ethersAny = ethers as any
    const JsonRpcProviderClass =
      ethersAny.providers?.JsonRpcProvider ?? ethersAny['JsonRpcProvider']
    this.#provider = new JsonRpcProviderClass(url)
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

      // Use bracket notation to prevent webpack from statically analyzing the export
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ethersAny = ethers as any
      const ContractClass = ethersAny.Contract ?? ethersAny['Contract']
      const resolverContract = new ContractClass(address, abi, this.#provider)
      const node =
        ethersAny.utils?.namehash?.(ensName) ?? ethersAny['namehash']?.(ensName)
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
      // Use bracket notation to prevent webpack from statically analyzing the export
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ethersAny = ethers as any
      const ContractClass = ethersAny.Contract ?? ethersAny['Contract']
      const registryContract = new ContractClass(
        registryContractAddress,
        ['function getEntry(address _communityAddress) view returns (address)'],
        this.#provider,
      )
      const ownerContractAddress = await registryContract.getEntry(
        publicKeyToETHAddress(communityPublicKey),
      )

      const ownerContract = new ContractClass(
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
