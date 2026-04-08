import { createTRPCProxyClient } from '@trpc/client'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { createChromeHandler } from 'trpc-chrome/adapter'
import {
  signMessage as viemSignMessage,
  signTypedData as viemSignTypedData,
} from 'viem/accounts'
import { z } from 'zod'

import * as bitcoin from './bitcoin/bitcoin'
import { chromeLinkWithRetries } from './chromeLink'
import {
  deriveAccount,
  deriveNextAccountIndex,
  derivePrivateKey,
  privateKeyFromData,
} from './derive'
import * as ethereum from './ethereum/ethereum'
import * as sessionManager from './session'
import * as solana from './solana/solana'
import { encryptAndStore, hasVault } from './vault'
import { getWalletCore } from './wallet'
import * as walletMetadata from './wallet-metadata'

import type { WalletAccount, WalletMeta } from './wallet-metadata'

const createContext = async () => {
  const walletCore = await getWalletCore()
  return { walletCore, session: sessionManager }
}

type Context = Awaited<ReturnType<typeof createContext>>

async function getSigningKey(
  ctx: Context,
  walletId: string,
  wallet: WalletMeta,
  account: WalletAccount,
  coin: InstanceType<Context['walletCore']['CoinType']>,
): Promise<ReturnType<typeof derivePrivateKey>> {
  const { walletCore, session } = ctx
  if (wallet.type === 'mnemonic') {
    const mnemonic = await session.getMnemonic(walletId)
    return derivePrivateKey(walletCore, mnemonic, coin, account.derivationPath)
  }
  const hex = await session.getPrivateKeyData(walletId)
  return privateKeyFromData(walletCore, walletCore.HexCoding.decode(hex))
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  isServer: false,
  allowOutsideOfServer: true,
})

const { createCallerFactory, router } = t

const procedure = t.procedure.use(async ({ next, ctx }) => {
  await ctx.session.resetInactivityTimer()
  return next({ ctx })
})

const apiRouter = router({
  session: router({
    unlock: procedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input }) => {
        await sessionManager.unlock(input.password)
        return { unlocked: true }
      }),
    lock: procedure.mutation(async () => {
      await sessionManager.lock()
    }),
    status: procedure.query(async () => {
      const isUnlocked = await sessionManager.isUnlocked()
      return { isUnlocked }
    }),
  }),

  wallet: router({
    all: procedure.query(async () => {
      return walletMetadata.getAll()
    }),

    // todo: validation (e.g. password, mnemonic, already exists)
    // todo: words count option
    // todo: handle cancelation
    add: procedure
      .input(z.object({ password: z.string(), name: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const { walletCore, session } = ctx
        const hd = walletCore.HDWallet.create(128, input.password)
        const mnemonic = hd.mnemonic()
        hd.delete()
        const id = crypto.randomUUID()
        const account = deriveAccount(
          walletCore,
          mnemonic,
          walletCore.CoinType.ethereum,
          walletCore.Derivation.default,
          0,
        )
        if (await hasVault()) {
          await session.addWalletToVault(id, 'mnemonic', mnemonic)
        } else {
          await encryptAndStore(input.password, {
            wallets: { [id]: { type: 'mnemonic', secret: mnemonic } },
          })
          await session.resetInactivityTimer()
        }
        await walletMetadata.save({
          id,
          name: input.name,
          type: 'mnemonic',
          activeAccounts: [account],
        })
        return {
          // note: reference and store accounts with
          id,
          mnemonic,
        }
      }),

    get: procedure
      .input(z.object({ walletId: z.string() }))
      .query(async ({ input, ctx }) => {
        const meta = await walletMetadata.get(input.walletId)
        if (!meta) throw new Error('Wallet not found')
        let mnemonic: string | undefined
        if ((await ctx.session.isUnlocked()) && meta.type === 'mnemonic') {
          try {
            mnemonic = await ctx.session.getMnemonic(input.walletId)
          } catch {
            // ignore
          }
        }
        return { id: meta.id, name: meta.name, mnemonic }
      }),

    import: procedure
      .input(
        z.object({
          mnemonic: z.string(),
          name: z.string(),
          password: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletCore, session } = ctx
        const id = crypto.randomUUID()
        const account = deriveAccount(
          walletCore,
          input.mnemonic,
          walletCore.CoinType.ethereum,
          walletCore.Derivation.default,
          0,
        )
        if (await hasVault()) {
          await session.addWalletToVault(id, 'mnemonic', input.mnemonic)
        } else {
          await encryptAndStore(input.password, {
            wallets: { [id]: { type: 'mnemonic', secret: input.mnemonic } },
          })
          await session.resetInactivityTimer()
        }
        await walletMetadata.save({
          id,
          name: input.name,
          type: 'mnemonic',
          activeAccounts: [account],
        })
        return { id, mnemonic: input.mnemonic }
      }),

    account: router({
      all: procedure
        .input(z.object({ walletId: z.string() }))
        .query(async ({ input }) => {
          const wallet = await walletMetadata.get(input.walletId)
          if (!wallet) throw new Error('Wallet not found')
          return wallet.activeAccounts
        }),

      ethereum: router({
        add: procedure
          .input(
            z.object({
              walletId: z.string(),
              name: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const mnemonic = await ctx.session.getMnemonic(input.walletId)
            const index = deriveNextAccountIndex(
              wallet.activeAccounts,
              walletCore.CoinType.ethereum.value,
            )
            const account = deriveAccount(
              walletCore,
              mnemonic,
              walletCore.CoinType.ethereum,
              walletCore.Derivation.default,
              index,
            )
            await walletMetadata.addAccount(input.walletId, account)
            return { id: account.address }
          }),

        // note: our first tx https://holesky.etherscan.io/tx/0xdc2aa244933260c50e665aa816767dce6b76d5d498e6358392d5f79bfc9626d5
        send: procedure
          .input(
            z.object({
              walletId: z.string(),
              fromAddress: z.string(),
              toAddress: z.string(),
              amount: z.string(),
              gasLimit: z.string(),
              maxFeePerGas: z.string(),
              maxInclusionFeePerGas: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const account = wallet.activeAccounts.find(
              a => a.address === input.fromAddress,
            )
            if (!account) throw new Error('From address not found')
            const privateKey = await getSigningKey(
              ctx,
              input.walletId,
              wallet,
              account,
              ctx.walletCore.CoinType.ethereum,
            )
            try {
              const id = await ethereum.send({
                walletCore,
                walletPrivateKey: privateKey,
                chainID: '31337',
                toAddress: input.toAddress,
                amount: input.amount,
                fromAddress: input.fromAddress,
                gasLimit: input.gasLimit,
                maxFeePerGas: input.maxFeePerGas,
                maxInclusionFeePerGas: input.maxInclusionFeePerGas,
              })
              return { id }
            } finally {
              privateKey.delete()
            }
          }),

        sendErc20: procedure
          .input(
            z.object({
              walletId: z.string(),
              fromAddress: z.string(),
              toAddress: z.string(),
              gasLimit: z.string(),
              maxFeePerGas: z.string(),
              maxInclusionFeePerGas: z.string(),
              data: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const account = wallet.activeAccounts.find(
              a => a.address === input.fromAddress,
            )
            if (!account) throw new Error('From address not found')
            const privateKey = await getSigningKey(
              ctx,
              input.walletId,
              wallet,
              account,
              ctx.walletCore.CoinType.ethereum,
            )
            try {
              const id = await ethereum.sendErc20({
                walletCore,
                walletPrivateKey: privateKey,
                chainID: '31337',
                toAddress: input.toAddress,
                fromAddress: input.fromAddress,
                gasLimit: input.gasLimit,
                maxFeePerGas: input.maxFeePerGas,
                maxInclusionFeePerGas: input.maxInclusionFeePerGas,
                data: input.data,
              })
              return { id }
            } finally {
              privateKey.delete()
            }
          }),

        sendContractCall: procedure
          .input(
            z.object({
              walletId: z.string(),
              fromAddress: z.string(),
              toAddress: z.string(),
              gasLimit: z.string(),
              maxFeePerGas: z.string(),
              maxInclusionFeePerGas: z.string(),
              data: z.string(),
              value: z.string().optional(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const account = wallet.activeAccounts.find(
              a => a.address === input.fromAddress,
            )
            if (!account) throw new Error('From address not found')
            const privateKey = await getSigningKey(
              ctx,
              input.walletId,
              wallet,
              account,
              ctx.walletCore.CoinType.ethereum,
            )
            try {
              const id = await ethereum.sendContractCall({
                walletCore,
                walletPrivateKey: privateKey,
                chainID: '31337',
                toAddress: input.toAddress,
                fromAddress: input.fromAddress,
                gasLimit: input.gasLimit,
                maxFeePerGas: input.maxFeePerGas,
                maxInclusionFeePerGas: input.maxInclusionFeePerGas,
                data: input.data,
                value: input.value,
              })
              return { id }
            } finally {
              privateKey.delete()
            }
          }),

        signMessage: procedure
          .input(
            z.object({
              walletId: z.string(),
              fromAddress: z.string(),
              message: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const account = wallet.activeAccounts.find(
              a => a.address === input.fromAddress,
            )
            if (!account) throw new Error('From address not found')
            const privateKey = await getSigningKey(
              ctx,
              input.walletId,
              wallet,
              account,
              ctx.walletCore.CoinType.ethereum,
            )
            try {
              const privateKeyHex = walletCore.HexCoding.encode(
                privateKey.data(),
              )
              const message = input.message.startsWith('0x')
                ? { raw: input.message as `0x${string}` }
                : input.message
              const signature = await viemSignMessage({
                message,
                privateKey: privateKeyHex as `0x${string}`,
              })
              return { signature }
            } finally {
              privateKey.delete()
            }
          }),

        signTypedData: procedure
          .input(
            z.object({
              walletId: z.string(),
              fromAddress: z.string(),
              domain: z.record(z.unknown()),
              types: z.record(
                z.array(z.object({ name: z.string(), type: z.string() })),
              ),
              primaryType: z.string(),
              message: z.record(z.unknown()),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const account = wallet.activeAccounts.find(
              a => a.address === input.fromAddress,
            )
            if (!account) throw new Error('From address not found')
            const privateKey = await getSigningKey(
              ctx,
              input.walletId,
              wallet,
              account,
              ctx.walletCore.CoinType.ethereum,
            )
            try {
              const privateKeyHex = walletCore.HexCoding.encode(
                privateKey.data(),
              )
              const signature = await viemSignTypedData({
                domain: input.domain,
                types: input.types,
                primaryType: input.primaryType,
                message: input.message,
                privateKey: privateKeyHex as `0x${string}`,
              })
              return { signature }
            } finally {
              privateKey.delete()
            }
          }),
      }),

      bitcoin: router({
        // note?: create all variants (e.g. segwit, nested segwit, legacy, taproot) for each added account by default
        add: procedure
          .input(z.object({ walletId: z.string() }))
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const mnemonic = await ctx.session.getMnemonic(input.walletId)
            const derivations = [
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
            ]
            for (const d of derivations) {
              const acc = deriveAccount(
                walletCore,
                mnemonic,
                d.coin,
                d.derivation,
                0,
              )
              await walletMetadata.addAccount(input.walletId, acc)
            }
            return { id: input.walletId }
          }),

        // note: our first tx https://mempool.space/testnet4/tx/4d1797f4a6e92ab5164cfa8030e5954670f162e2aae792c8d6d6a81aae32fbd4
        send: procedure
          .input(
            z.object({
              walletId: z.string(),
              fromAddress: z.string(),
              toAddress: z.string(),
              amount: z.number(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const account = wallet.activeAccounts.find(
              a => a.address === input.fromAddress,
            )
            if (!account) throw new Error('From address not found')
            const privateKey = await getSigningKey(
              ctx,
              input.walletId,
              wallet,
              account,
              ctx.walletCore.CoinType.bitcoin,
            )
            try {
              const id = await bitcoin.send({
                walletCore,
                walletPrivateKey: privateKey,
                fromAddress: input.fromAddress,
                toAddress: input.toAddress,
                amount: input.amount,
              })
              return { id }
            } finally {
              privateKey.delete()
            }
          }),
      }),

      solana: router({
        add: procedure
          .input(z.object({ walletId: z.string() }))
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const mnemonic = await ctx.session.getMnemonic(input.walletId)
            const index = deriveNextAccountIndex(
              wallet.activeAccounts,
              walletCore.CoinType.solana.value,
            )
            const account = deriveAccount(
              walletCore,
              mnemonic,
              walletCore.CoinType.solana,
              walletCore.Derivation.solanaSolana,
              index,
            )
            await walletMetadata.addAccount(input.walletId, account)
            return { id: account.address }
          }),

        // note: our first tx https://solscan.io/tx/LNgKUb6bewbcgVXi9NBF4qYNJC5kjMPpH5GDVZBsVXFC7MDhYtdygkuP1avq7c31bHDkr9pkKYvMSdT16mt294g?cluster=devnet
        send: procedure
          .input(
            z.object({
              walletId: z.string(),
              fromAddress: z.string(),
              toAddress: z.string(),
              amount: z.number(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')
            const account = wallet.activeAccounts.find(
              a => a.address === input.fromAddress,
            )
            if (!account) throw new Error('From address not found')
            const privateKey = await getSigningKey(
              ctx,
              input.walletId,
              wallet,
              account,
              ctx.walletCore.CoinType.solana,
            )
            try {
              const id = await solana.send({
                walletCore,
                walletPrivateKey: privateKey,
                fromAddress: input.fromAddress,
                toAddress: input.toAddress,
                amount: input.amount,
              })
              return { id }
            } finally {
              privateKey.delete()
            }
          }),
      }),

      cardano: router({
        add: procedure
          .input(z.object({ walletId: z.string() }))
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const wallet = await walletMetadata.get(input.walletId)
            if (!wallet) throw new Error('Wallet not found')

            const mnemonic = await ctx.session.getMnemonic(input.walletId)
            const index = deriveNextAccountIndex(
              wallet.activeAccounts,
              walletCore.CoinType.cardano.value,
            )
            const account = deriveAccount(
              walletCore,
              mnemonic,
              walletCore.CoinType.cardano,
              walletCore.Derivation.default,
              index,
            )
            await walletMetadata.addAccount(input.walletId, account)
            return { id: account.address }
          }),
      }),
    }),
  }),

  privateKey: router({
    import: procedure
      .input(
        z.object({
          privateKey: z.string(),
          name: z.string(),
          password: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletCore, session } = ctx
        const hex = input.privateKey.replace(/^0x/, '')
        const keyBytes = walletCore.HexCoding.decode(hex)
        const pk = walletCore.PrivateKey.createWithData(keyBytes)
        const address = walletCore.CoinTypeExt.deriveAddress(
          walletCore.CoinType.ethereum,
          pk,
        )
        pk.delete()
        const id = crypto.randomUUID()
        const account = {
          address,
          coin: walletCore.CoinType.ethereum.value,
          derivationPath: "m/44'/60'/0'/0/0",
          derivation: walletCore.Derivation.default.value,
        }
        if (await hasVault()) {
          await session.addWalletToVault(id, 'privateKey', hex)
        } else {
          await encryptAndStore(input.password, {
            wallets: { [id]: { type: 'privateKey', secret: hex } },
          })
          await session.resetInactivityTimer()
        }
        await walletMetadata.save({
          id,
          name: input.name,
          type: 'privateKey',
          activeAccounts: [account],
        })
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
