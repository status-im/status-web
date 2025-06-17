import { initTRPC } from '@trpc/server'

import type { KeyStore } from '@trustwallet/wallet-core'

export interface PasswordAuthParams {
  password?: string
  walletId?: string
}

type Context = {
  keyStore: KeyStore.Default
}

export type ValidPasswordContext = {
  validPassword?: string
}

export function createPasswordAuthPlugin<TContext extends Context>() {
  const t = initTRPC.context<TContext>().create({
    isServer: false,
    allowOutsideOfServer: true,
  })

  return t.procedure.use(async opts => {
    const { ctx } = opts
    const { keyStore } = ctx
    const params = (await opts.getRawInput()) as PasswordAuthParams
    if (
      typeof params?.password !== 'string' ||
      typeof params?.walletId !== 'string'
    )
      return opts.next()

    let validPassword: undefined | string

    await keyStore
      .export(params.walletId, params.password)
      .then(() => {
        validPassword = params.password
      })
      .catch(() => {})

    return opts.next({ ctx: { validPassword } })
  })
}
