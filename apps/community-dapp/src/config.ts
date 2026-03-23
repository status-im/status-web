// import { v4 as uuidv4 } from 'uuid'
import { Chain, ChainId, Optimism, Config as DAppConfig, Localhost, Hardhat } from '@usedapp/core'
import { peers } from '@status-im/js'

const version = '0.0.6'

const OptimismSepolia: Chain = {
  chainId: 11155420,
  chainName: 'OptimismSepolia',
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
  rpcUrl: 'https://sepolia.optimism.io/',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrl: 'https://sepolia-optimistic.etherscan.io/',
  getExplorerAddressLink: (address: string) => `https://sepolia-optimistic.etherscan.io/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://sepolia-optimistic.etherscan.io/tx/${transactionHash}`,
}

export interface Config {
  wakuConfig: {
    peers: string[]
    wakuTopic: string
    wakuFeatureTopic: string
    clusterId: number
    shards: number[]
  }
  usedappConfig: DAppConfig
  contracts: Record<number, Record<string, string>>
  votesLimit: number
}

/**
 * @see https://vercel.com/docs/concepts/projects/environment-variables#environments for environment descriptions
 */
const configs: Record<typeof process.env.ENV, Config> = {
  /**
   * Localhost/Development.
   */
  development: {
    wakuConfig: {
      peers: peers.development,
      wakuTopic: `/communitiesCuration/localhost/${version}/directory/proto/`,
      wakuFeatureTopic: `/communitiesCuration/localhost/${version}/featured/proto/`,
      clusterId: 16,
      shards: [32, 128, 256],
    },
    usedappConfig: {
      readOnlyChainId: ChainId.Hardhat,
      readOnlyUrls: {
        [ChainId.Hardhat]: 'http://127.0.0.1:8545',
        [ChainId.Localhost]: 'http://127.0.0.1:8545',
      },
      networks: [Localhost, Hardhat],
      multicallAddresses: {
        [ChainId.Hardhat]: process.env.MULTICALL_CONTRACT!,
        [ChainId.Localhost]: process.env.MULTICALL_CONTRACT!,
      },
      notifications: {
        checkInterval: 500,
        expirationPeriod: 50000,
      },
    },
    votesLimit: 2,
    contracts: {
      [ChainId.Hardhat]: {
        votingContract: process.env.VOTING_CONTRACT ?? '0x0000000000000000000000000000000000000000',
        directoryContract: process.env.DIRECTORY_CONTRACT ?? '0x0000000000000000000000000000000000000000',
        tokenContract: process.env.TOKEN_CONTRACT ?? '0x0000000000000000000000000000000000000000',
        multicallContract: process.env.MULTICALL_CONTRACT ?? '0x0000000000000000000000000000000000000000',
        featuredVotingContract: process.env.FEATURED_VOTING_CONTRACT ?? '0x0000000000000000000000000000000000000000',
      },
    },
  },
  /**
   * Preview.
   *
   * All preview deployments (from pull requests) will share voting history.
   */
  preview: {
    wakuConfig: {
      peers: peers.preview,
      wakuTopic: `/communitiesCuration/preview/${version}/directory/proto/`,
      wakuFeatureTopic: `/communitiesCuration/preview/${version}/featured/proto/`,
      clusterId: 16,
      shards: [32, 128, 256],
    },
    usedappConfig: {
      readOnlyChainId: OptimismSepolia.chainId,
      readOnlyUrls: {
        [OptimismSepolia.chainId]: `https://optimism-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      },
      networks: [OptimismSepolia],
      notifications: {
        checkInterval: 500,
        expirationPeriod: 50000,
      },
    },
    votesLimit: 2,
    contracts: {
      [OptimismSepolia.chainId]: {
        votingContract: '0x7Ff554af5b6624db2135E4364F416d1D397f43e6',
        featuredVotingContract: '0x336DFD512164Fe8CFA809BdE94B13E76e42edD6B',
        directoryContract: '0x6B94e21FAB8Af38E8d89dd4A0480C04e9a5c53Ab',
        tokenContract: '0x0B5DAd18B8791ddb24252B433ec4f21f9e6e5Ed0',
        multicallContract: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
  },
  /**
   * Production.
   */
  production: {
    wakuConfig: {
      peers: peers.production,
      wakuTopic: `/communitiesCuration/${version}/directory/proto/`,
      wakuFeatureTopic: `/communitiesCuration/${version}/featured/proto/`,
      clusterId: 16,
      shards: [32, 128, 256],
    },
    usedappConfig: {
      readOnlyChainId: ChainId.Optimism,
      readOnlyUrls: {
        [ChainId.Optimism]: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      },
      networks: [Optimism],
      notifications: {
        checkInterval: 500,
        expirationPeriod: 50000,
      },
    },
    votesLimit: 400,
    contracts: {
      [ChainId.Optimism]: {
        votingContract: '0x321Ba646d994200257Ce4bfe18F66C9283ad1407',
        featuredVotingContract: '0x2EA9700E7F27E09F254f2DaEc5E05015b2b961d0',
        directoryContract: '0xA8d270048a086F5807A8dc0a9ae0e96280C41e3A',
        tokenContract: '0x650AF3C15AF43dcB218406d30784416D64Cfb6B2',
        multicallContract: '0xeAa6877139d436Dc6d1f75F3aF15B74662617B2C',
      },
    },
  },
}

export const config = configs[process.env.ENV]
