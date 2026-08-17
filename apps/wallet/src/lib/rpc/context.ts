export type RpcContext = {
  method: string
  params: unknown
  origin: string
  metadata?: { title?: string; favicon?: string }
}

export type LocalHandler = (ctx: RpcContext) => Promise<unknown>
