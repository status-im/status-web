// import { Cardano } from '@cardano-sdk/core'
// import { SodiumBip32Ed25519 } from '@cardano-sdk/crypto'
// import { AddressType, InMemoryKeyAgent } from '@cardano-sdk/key-management'
import { createTRPCProxyClient } from '@trpc/client'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { createChromeHandler } from 'trpc-chrome/adapter'
import { z } from 'zod'

import * as bitcoin from './bitcoin/bitcoin'
import { chromeLinkWithRetries } from './chromeLink'
import * as ethereum from './ethereum/ethereum'
import { getKeystore } from './keystore'
import * as solana from './solana/solana'
import {
  getWalletCore,
  //  type WalletCore
} from './wallet'

const createContext = async () => {
  const keyStore = await getKeystore()
  const walletCore = await getWalletCore()

  return {
    keyStore,
    walletCore,
  }
}

type Context = Awaited<ReturnType<typeof createContext>>

/**
 * @see https://trpc.io/docs/server/routers#runtime-configuration
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  isServer: false,
  allowOutsideOfServer: true,
})

// const publicProcedure = t.procedure
const { createCallerFactory, router } = t

// todo: lock with password as trpc auth procedure
// todo?: expose password in context or use other (session) token derived from it for encrypting and storing
const apiRouter = router({
  wallet: router({
    all: t.procedure.query(async ({ ctx }) => {
      const { keyStore } = ctx

      const wallets = await keyStore.loadAll()

      return wallets
    }),

    // todo: validation (e.g. password, mnemonic, already exists)
    // todo: words count option
    // todo: handle cancelation
    add: t.procedure
      .input(
        z.object({
          password: z.string(),
          name: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletCore, keyStore } = ctx

        const wallet = walletCore.HDWallet.create(128, input.password)
        const mnemonic = wallet.mnemonic()
        const name = input.name

        // // note: .account(0).coin() would return undefined and .address() an empty string
        // const key = walletCore.StoredKey.create(
        //   'unknown wallet',
        //   Buffer.from(input.password),
        // )

        const key = walletCore.StoredKey.importHDWallet(
          mnemonic,
          name,
          Buffer.from(input.password),
          // note: default to ethereum or parameterize
          walletCore.CoinType.ethereum,
          // walletCore.CoinType.bitcoin,
          // walletCore.CoinType.solana,
          //   walletCore.CoinType.cardano,
        )

        // fimxe: export all and check if mnemonic is in store already
        // note: new accounts under same mnemonic don't need to be imported into keystore (extension store) again
        const { id } = await keyStore.import(
          mnemonic,
          name,
          input.password,
          // todo: test if setting modifies data or can be arbitrary
          [key.account(0).coin()],
          walletCore.StoredKeyEncryption.aes256Ctr,
        )

        return {
          // note: reference and store accounts with
          id,
          mnemonic,
        }
      }),

    get: t.procedure
      .input(
        z.object({
          walletId: z.string(),
          password: z.string(),
        }),
      )
      .query(async ({ input, ctx }) => {
        const { keyStore } = ctx

        const wallet = await keyStore.load(input.walletId)

        return {
          id: wallet.id,
          name: wallet.name,
          mnemonic: await keyStore.exportMnemonic(wallet.id, input.password),
        }
      }),

    import: t.procedure
      .input(
        z.object({
          mnemonic: z.string(),
          name: z.string(),
          password: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletCore, keyStore } = ctx

        // const limited_wallet = await keyStore.import(
        //   input.mnemonic,
        //   input.name,
        //   input.password,
        //   [
        //     walletCore.CoinType.ethereum,
        //     // walletCore.CoinType.bitcoin,
        //     // walletCore.CoinType.solana,
        //   ],
        //   walletCore.StoredKeyEncryption.aes256Ctr,
        // )

        // const without_default_account_wallet =
        //   walletCore.HDWallet.createWithMnemonic(input.mnemonic, input.password)

        // note: key is mnemonic-derived
        const key = walletCore.StoredKey.importHDWallet(
          input.mnemonic,
          input.name,
          Buffer.from(input.password),
          walletCore.CoinType.ethereum,
        )

        // todo: extract and call fromm all relevant procedures
        const { id } = await keyStore.import(
          input.mnemonic,
          input.name,
          input.password,
          [key.account(0).coin()],
          walletCore.StoredKeyEncryption.aes256Ctr,
        )

        // todo: remove
        const mnemonic = (await keyStore.export(id, input.password)) as string

        return {
          id,
          mnemonic,
        }
      }),

    account: router({
      all: t.procedure
        .input(
          z.object({
            walletId: z.string(),
          }),
        )
        .query(async ({ input, ctx }) => {
          const { keyStore } = ctx

          const wallet = await keyStore.load(input.walletId)

          return wallet.activeAccounts
        }),

      ethereum: router({
        add: t.procedure
          .input(
            z.object({
              walletId: z.string(),
              password: z.string(),
              name: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { keyStore, walletCore } = ctx

            const wallet = await keyStore.load(input.walletId)

            // todo!: test calling multiple times
            // const { id } = await keyStore.addAccounts(
            //   wallet.id,
            //   input.password,
            //   [walletCore.CoinType.ethereum],
            // )

            const { id } = await keyStore.addAccountsWithDerivations(
              wallet.id,
              input.password,
              [
                {
                  // coin: wallet.activeAccounts[0].coin,
                  coin: walletCore.CoinType.ethereum,
                  derivation: walletCore.Derivation.default,
                },
              ],
            )

            // note: add account with custom derivation path
            // const mnemonic = (await keyStore.export(
            //   wallet.id,
            //   input.password,
            // )) as string
            // // fixme: calculate index based on last account
            // const index = 0
            // const derivationPath = `m/44'/60'/0'/0/${index}`

            // const key = walletCore.StoredKey.importHDWallet(
            //   mnemonic,
            //   input.name,
            //   Buffer.from(input.password),
            //   walletCore.CoinType.ethereum,
            // )

            // const privateKey = key
            //   .wallet(Buffer.from(input.password))
            //   .getKey(walletCore.CoinType.ethereum, derivationPath)

            // // note!: would be categorized separatley from mnemonic wallet and as as private key, so if used instead of adding accounts add private keys from the start
            // const { id } = await keyStore.importKey(
            //   privateKey.data(),
            //   'untitled',
            //   input.password,
            //   walletCore.CoinType.ethereum,
            //   walletCore.StoredKeyEncryption.aes256Ctr,
            // )

            return {
              // todo?: return account info instead
              id,
            }
          }),

        // note: our first tx https://holesky.etherscan.io/tx/0xdc2aa244933260c50e665aa816767dce6b76d5d498e6358392d5f79bfc9626d5
        send: t.procedure
          .input(
            z.object({
              walletId: z.string(),
              password: z.string(),
              fromAddress: z.string(),
              toAddress: z.string(),
              amount: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { keyStore, walletCore } = ctx

            const wallet = await keyStore.load(input.walletId)

            const account = wallet.activeAccounts.find(
              account => account.address === input.fromAddress,
            )

            if (!account) {
              throw new Error('From address not found')
            }

            // const mnemonic = (await keyStore.export(
            //   wallet.id,
            //   input.password,
            // )) as string

            // const key = walletCore.StoredKey.importHDWallet(
            //   mnemonic,
            //   wallet.name,
            //   Buffer.from(input.password),
            //   walletCore.CoinType.ethereum,
            // )

            // const privateKey = key
            //   .wallet(Buffer.from(input.password))
            //   .getKey(walletCore.CoinType.ethereum, account.derivationPath)

            const privateKey = await keyStore.getKey(
              wallet.id,
              input.password,
              account,
            )

            const id = await ethereum.send({
              walletCore,
              walletPrivateKey: privateKey,
              // fimxe: set from settings in context (e.g. testnet)
              chainID: '0x1',
              toAddress: input.toAddress,
              amount: input.amount,
            })

            return {
              id,
            }
          }),
      }),

      bitcoin: router({
        // note?: create all variants (e.g. segwit, nested segwit, legacy, taproot) for each added account by default
        add: t.procedure
          .input(
            z.object({
              walletId: z.string(),
              password: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { keyStore, walletCore } = ctx

            const wallet = await keyStore.load(input.walletId)

            const { id } = await keyStore.addAccountsWithDerivations(
              wallet.id,
              input.password,
              [
                {
                  coin: walletCore.CoinType.bitcoin,
                  derivation: walletCore.Derivation.bitcoinSegwit, // native segwit
                },
                // note!: not supported
                // {
                //   coin: walletCore.CoinType.bitcoin,
                //   derivation: walletCore.Derivation.bitcoinNestedSegwit, // nested segwit
                // },
                {
                  coin: walletCore.CoinType.bitcoin,
                  derivation: walletCore.Derivation.bitcoinTaproot,
                },
                {
                  coin: walletCore.CoinType.bitcoin,
                  derivation: walletCore.Derivation.bitcoinLegacy,
                },
                {
                  coin: walletCore.CoinType.bitcoin,
                  derivation: walletCore.Derivation.bitcoinTestnet,
                },
              ],
            )

            // note!: second default derivation; does not add new account
            // await keyStore.addAccountsWithDerivations(
            //   wallet.id,
            //   input.password,
            //   [
            //     {
            //       coin: walletCore.CoinType.bitcoin,
            //       derivation: walletCore.Derivation.bitcoinSegwit,
            //     },
            //   ],
            // )

            return {
              id,
            }
          }),

        // note: our first tx https://mempool.space/testnet4/tx/4d1797f4a6e92ab5164cfa8030e5954670f162e2aae792c8d6d6a81aae32fbd4
        send: t.procedure
          .input(
            z.object({
              walletId: z.string(),
              password: z.string(),
              fromAddress: z.string(),
              toAddress: z.string(),
              amount: z.number(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { keyStore, walletCore } = ctx

            const wallet = await keyStore.load(input.walletId)

            const account = wallet.activeAccounts.find(
              account => account.address === input.fromAddress,
            )

            if (!account) {
              throw new Error('From address not found')
            }

            const privateKey = await keyStore.getKey(
              wallet.id,
              input.password,
              account,
            )

            const id = await bitcoin.send({
              walletCore,
              walletPrivateKey: privateKey,
              fromAddress: input.fromAddress,
              toAddress: input.toAddress,
              amount: input.amount,
            })

            return {
              id,
            }
          }),
      }),

      solana: router({
        add: t.procedure
          .input(
            z.object({
              walletId: z.string(),
              password: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { keyStore, walletCore } = ctx

            const wallet = await keyStore.load(input.walletId)

            const { id } = await keyStore.addAccounts(
              wallet.id,
              input.password,
              [walletCore.CoinType.solana],
            )

            return {
              id,
            }
          }),

        // note: our first tx https://solscan.io/tx/LNgKUb6bewbcgVXi9NBF4qYNJC5kjMPpH5GDVZBsVXFC7MDhYtdygkuP1avq7c31bHDkr9pkKYvMSdT16mt294g?cluster=devnet
        send: t.procedure
          .input(
            z.object({
              walletId: z.string(),
              password: z.string(),
              fromAddress: z.string(),
              toAddress: z.string(),
              amount: z.number(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { keyStore, walletCore } = ctx

            const wallet = await keyStore.load(input.walletId)

            const account = wallet.activeAccounts.find(
              account => account.address === input.fromAddress,
            )

            if (!account) {
              throw new Error('From address not found')
            }

            const privateKey = await keyStore.getKey(
              wallet.id,
              input.password,
              account,
            )

            const id = await solana.send({
              walletCore,
              walletPrivateKey: privateKey,
              fromAddress: input.fromAddress,
              toAddress: input.toAddress,
              amount: input.amount,
            })

            return {
              id,
            }
          }),
      }),

      cardano: router({
        add: t.procedure
          .input(
            z.object({
              walletId: z.string(),
              password: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { keyStore, walletCore } = ctx

            const wallet = await keyStore.load(input.walletId)

            const { id } = await keyStore.addAccounts(
              wallet.id,
              input.password,
              [walletCore.CoinType.cardano],
            )

            // note: derive testnet/preview address
            // const mnemonic = (await keyStore.export(
            //   wallet.id,
            //   input.password,
            // )) as string
            // const agent = await InMemoryKeyAgent.fromBip39MnemonicWords(
            //   {
            //     chainId: Cardano.ChainIds.Preview, // preview
            //     mnemonicWords: mnemonic.split(' '),
            //     // accountIndex: 0,
            //     // purpose: 44,
            //     getPassphrase: () =>
            //       Promise.resolve(Buffer.from(input.password)),
            //   },
            //   {
            //     bip32Ed25519: await SodiumBip32Ed25519.create(),
            //     logger: null,
            //   },
            // )
            // const address = agent.deriveAddress(
            //   {
            //     type: AddressType.Internal,
            //     index: 0,
            //   },
            //   0,
            // )

            return {
              id,
            }
          }),
      }),
    }),
  }),

  privateKey: router({
    import: t.procedure
      .input(
        z.object({
          privateKey: z.string(),
          name: z.string(),
          password: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletCore, keyStore } = ctx

        // const key = walletCore.StoredKey.importPrivateKey(
        //   Buffer.from(input.privateKey),
        //   input.name,
        //   Buffer.from(input.password),
        //   walletCore.CoinType.ethereum,
        // )

        // const { id } = await keyStore.importKey(
        //   key.decryptPrivateKey(Buffer.from(input.password)),
        //   input.name,
        //   input.password,
        //   walletCore.CoinType.ethereum,
        //   walletCore.StoredKeyEncryption.aes256Ctr,
        // )

        const { id } = await keyStore.importKey(
          new Uint8Array(Buffer.from(input.privateKey)),
          input.name,
          input.password,
          walletCore.CoinType.ethereum,
          walletCore.StoredKeyEncryption.aes256Ctr,
        )

        return {
          // reference stored (single) account
          id,
        }
      }),
  }),
})

export type APIRouter = typeof apiRouter

export async function createAPI() {
  // @ts-expect-error: fixme!:
  createChromeHandler({ router: apiRouter, createContext })

  const ctx = await createContext()
  const api = createCallerFactory(apiRouter)(ctx)

  return api
}

export function createAPIClient() {
  return createTRPCProxyClient<APIRouter>({
    links: [chromeLinkWithRetries()],
    transformer: superjson,
  })
}
