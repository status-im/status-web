import { createTRPCProxyClient } from '@trpc/client'
import { initTRPC, TRPCError } from '@trpc/server'
import superjson, { serialize } from 'superjson'
import { createChromeHandler } from 'trpc-chrome/adapter'
import { getAddress, isAddress } from 'viem'
import {
  signMessage as viemSignMessage,
  signTypedData as viemSignTypedData,
} from 'viem/accounts'
import { z } from 'zod'

import { discoverAccounts, hasActivity } from './account-discovery'
import * as bitcoin from './bitcoin/bitcoin'
import { chromeLinkWithRetries } from './chromeLink'
import {
  deriveAccount,
  deriveAccountsAtPaths,
  deriveNextAccountIndex,
  derivePrivateKey,
  nextDerivationPath,
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

const derivationPathSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^m(\/\d+'?)+$/, 'Invalid derivation path')

const hardwareWalletImportSchema = z.object({
  name: z.string().trim().min(1).max(80),
  vendor: z.string().trim().min(1).max(80),
  password: z.string().optional(),
  address: z
    .string()
    .trim()
    .refine(isAddress, 'Invalid Ethereum address')
    .transform(value => getAddress(value)),
  derivationPath: derivationPathSchema,
  publicKey: z
    .string()
    .trim()
    .min(1)
    .max(512)
    .regex(/^\S+$/, 'Invalid public key'),
  sourceFingerprint: z.number().int().nonnegative().max(0xffffffff).optional(),
})

// Loads a wallet that can derive new accounts (mnemonic only) and resolves
// the derivation path to use: the provided one, or the next sequential
// Ethereum path after the wallet's existing accounts.
async function resolveEthereumDerivation(
  walletCore: Context['walletCore'],
  walletId: string,
  derivationPath: string | undefined,
): Promise<{ wallet: WalletMeta; derivationPath: string }> {
  const wallet = await walletMetadata.get(walletId)
  if (!wallet) throw new Error('Wallet not found')
  // TRPCError so the message survives the chrome transport; trpc-chrome
  // replaces other error types with a generic "Internal server error"
  if (wallet.type !== 'mnemonic') {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message:
        'WALLET_CANNOT_DERIVE: only mnemonic wallets support deriving new accounts',
    })
  }
  return {
    wallet,
    derivationPath:
      derivationPath ??
      nextDerivationPath(
        walletCore,
        wallet.accounts,
        walletCore.CoinType.ethereum,
        walletCore.Derivation.default,
      ),
  }
}

async function getSigningKey(
  ctx: Context,
  walletId: string,
  wallet: WalletMeta,
  account: WalletAccount,
  coin: InstanceType<Context['walletCore']['CoinType']>,
): Promise<ReturnType<typeof derivePrivateKey>> {
  const { walletCore, session } = ctx
  if (wallet.type === 'hardware-qr') {
    throw new Error(
      'WALLET_IS_WATCH_ONLY: hardware-wallet signing requires the air-gapped QR sign flow which is not yet implemented',
    )
  }
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
  // trpc-chrome's handler posts this shape verbatim while its link runs it
  // through the transformer's deserialize; serialize here so error messages
  // survive the chrome transport instead of collapsing to "Unknown error"
  errorFormatter({ shape }) {
    return serialize(shape) as unknown as typeof shape
  },
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
      .input(
        z.object({
          password: z.string().optional(),
          name: z.string().optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletCore, session } = ctx
        const walletCount = (await walletMetadata.getAll()).length
        const walletName = input.name ?? `Wallet ${walletCount + 1}`
        const hd = walletCore.HDWallet.create(128, input.password ?? '')
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
          if (!input.password) {
            throw new Error('Password is required to create the first wallet')
          }
          await encryptAndStore(input.password, {
            wallets: { [id]: { type: 'mnemonic', secret: mnemonic } },
          })
          await session.resetInactivityTimer()
        }
        await walletMetadata.save({
          id,
          name: walletName,
          type: 'mnemonic',
          accounts: [account],
          selectedAccountAddress: account.address,
        })
        return {
          // note: reference and store accounts with
          id,
          name: walletName,
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

    // Derives the accounts of a mnemonic with on-chain activity so the user
    // can review them before importing. Does not persist anything.
    discoverAccounts: procedure
      .input(z.object({ mnemonic: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return discoverAccounts({
          walletCore: ctx.walletCore,
          mnemonic: input.mnemonic,
        })
      }),

    // Derives the account of a mnemonic at a custom derivation path and
    // reports whether it has on-chain activity. Does not persist anything.
    previewAccount: procedure
      .input(
        z.object({
          mnemonic: z.string(),
          derivationPath: derivationPathSchema,
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletCore } = ctx
        const [account] = deriveAccountsAtPaths(
          walletCore,
          input.mnemonic,
          walletCore.CoinType.ethereum,
          walletCore.Derivation.default,
          [input.derivationPath],
        )
        let active = false
        try {
          active = await hasActivity(account.address)
        } catch {
          // Activity check is informational only; ignore RPC failures
        }
        return { ...account, active }
      }),

    import: procedure
      .input(
        z.object({
          mnemonic: z.string(),
          name: z.string().optional(),
          password: z.string().optional(),
          derivationPaths: z.array(derivationPathSchema).max(100).optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletCore, session } = ctx
        const walletCount = (await walletMetadata.getAll()).length
        const walletName = input.name ?? `Wallet ${walletCount + 1}`
        const id = crypto.randomUUID()
        const accounts = input.derivationPaths?.length
          ? deriveAccountsAtPaths(
              walletCore,
              input.mnemonic,
              walletCore.CoinType.ethereum,
              walletCore.Derivation.default,
              [...new Set(input.derivationPaths)],
            )
          : (
              await discoverAccounts({
                walletCore,
                mnemonic: input.mnemonic,
              })
            ).map(account => ({
              address: account.address,
              coin: account.coin,
              derivationPath: account.derivationPath,
              derivation: account.derivation,
            }))
        if (await hasVault()) {
          await session.addWalletToVault(id, 'mnemonic', input.mnemonic)
        } else {
          if (!input.password) {
            throw new Error('Password is required to import the first wallet')
          }
          await encryptAndStore(input.password, {
            wallets: { [id]: { type: 'mnemonic', secret: input.mnemonic } },
          })
          await session.resetInactivityTimer()
        }
        await walletMetadata.save({
          id,
          name: walletName,
          type: 'mnemonic',
          accounts,
          selectedAccountAddress: accounts[0].address,
        })
        return { id, name: walletName, mnemonic: input.mnemonic }
      }),

    importHardware: procedure
      .input(hardwareWalletImportSchema)
      .mutation(async ({ input, ctx }) => {
        const { walletCore, session } = ctx
        const id = crypto.randomUUID()
        const account: WalletAccount = {
          address: input.address,
          coin: walletCore.CoinType.ethereum.value,
          derivationPath: input.derivationPath,
          derivation: walletCore.Derivation.default.value,
        }
        const vaultExists = await hasVault()
        if (!vaultExists) {
          if (!input.password) {
            throw new Error(
              'Password is required to import the first hardware wallet',
            )
          }
          await encryptAndStore(input.password, { wallets: {} })
          await session.resetInactivityTimer()
        }
        await walletMetadata.save({
          id,
          name: input.name,
          type: 'hardware-qr',
          accounts: [account],
          selectedAccountAddress: account.address,
          hardware: {
            vendor: input.vendor,
            publicKey: input.publicKey,
            sourceFingerprint: input.sourceFingerprint,
          },
        })
        return { id, name: input.name, address: input.address }
      }),

    account: router({
      all: procedure
        .input(z.object({ walletId: z.string() }))
        .query(async ({ input }) => {
          const wallet = await walletMetadata.get(input.walletId)
          if (!wallet) throw new Error('Wallet not found')
          return wallet.accounts
        }),

      // Persists which account is currently selected for a wallet.
      select: procedure
        .input(
          z.object({
            walletId: z.string(),
            address: z.string(),
          }),
        )
        .mutation(async ({ input }) => {
          await walletMetadata.setSelectedAccount(input.walletId, input.address)
          return { address: input.address }
        }),

      ethereum: router({
        add: procedure
          .input(
            z.object({
              walletId: z.string(),
              name: z.string().optional(),
              derivationPath: derivationPathSchema.optional(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const { wallet, derivationPath } = await resolveEthereumDerivation(
              walletCore,
              input.walletId,
              input.derivationPath,
            )
            if (wallet.accounts.some(a => a.derivationPath === derivationPath))
              throw new TRPCError({
                code: 'CONFLICT',
                message:
                  'ACCOUNT_ALREADY_EXISTS: derivation path already imported',
              })
            const mnemonic = await ctx.session.getMnemonic(input.walletId)
            const [account] = deriveAccountsAtPaths(
              walletCore,
              mnemonic,
              walletCore.CoinType.ethereum,
              walletCore.Derivation.default,
              [derivationPath],
            )
            if (wallet.accounts.some(a => a.address === account.address))
              throw new TRPCError({
                code: 'CONFLICT',
                message: 'ACCOUNT_ALREADY_EXISTS: address already imported',
              })
            await walletMetadata.addAccount(input.walletId, account)
            await walletMetadata.setSelectedAccount(
              input.walletId,
              account.address,
            )
            return account
          }),

        // Derives the account of an existing wallet at a derivation path (or
        // the next sequential path) and reports whether it has on-chain
        // activity and is already imported. Does not persist anything. Unlike
        // wallet.previewAccount, the mnemonic never leaves the background.
        preview: procedure
          .input(
            z.object({
              walletId: z.string(),
              derivationPath: derivationPathSchema.optional(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const { walletCore } = ctx
            const { wallet, derivationPath } = await resolveEthereumDerivation(
              walletCore,
              input.walletId,
              input.derivationPath,
            )
            const mnemonic = await ctx.session.getMnemonic(input.walletId)
            const [account] = deriveAccountsAtPaths(
              walletCore,
              mnemonic,
              walletCore.CoinType.ethereum,
              walletCore.Derivation.default,
              [derivationPath],
            )
            let active = false
            try {
              active = await hasActivity(account.address)
            } catch {
              // Activity check is informational only; ignore RPC failures
            }
            const alreadyImported = wallet.accounts.some(
              a =>
                a.derivationPath === account.derivationPath ||
                a.address === account.address,
            )
            return { ...account, active, alreadyImported }
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
            const account = wallet.accounts.find(
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
                chainID: '01',
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
            const account = wallet.accounts.find(
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
                chainID: '01',
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
            const account = wallet.accounts.find(
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
                chainID: '01',
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
            const account = wallet.accounts.find(
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
            const account = wallet.accounts.find(
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
            const account = wallet.accounts.find(
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
              wallet.accounts,
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
            const account = wallet.accounts.find(
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
              wallet.accounts,
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
          name: z.string().optional(),
          password: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletCore, session } = ctx
        const walletCount = (await walletMetadata.getAll()).length
        const walletName = input.name ?? `Wallet ${walletCount + 1}`
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
          name: walletName,
          type: 'privateKey',
          accounts: [account],
          selectedAccountAddress: account.address,
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
