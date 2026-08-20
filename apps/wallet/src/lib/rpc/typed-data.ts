import { ProviderRpcError } from '@status-im/ethereum-provider'

export type TypedDataField = { name: string; type: string }

export type TypedData = {
  domain: Record<string, unknown>
  types: Record<string, TypedDataField[]>
  primaryType: string
  message: Record<string, unknown>
}

/**
 * Refused before the popup rather than truncated inside it: the approval window
 * is the user's only look at what they are signing, and a payload no reviewer
 * can read is not something to render at all. Far beyond any legitimate
 * EIP-712 message. The display caps in `approval/typed-data-rows.ts` handle
 * what gets through.
 */
const MAX_SERIALIZED_LENGTH = 128 * 1024

function invalidParams(message: string): ProviderRpcError {
  return new ProviderRpcError({ code: -32602, message })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isField(value: unknown): value is TypedDataField {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.type === 'string'
  )
}

const DOMAIN_FIELDS = [
  'name',
  'version',
  'chainId',
  'verifyingContract',
  'salt',
]

/**
 * The domain fields that reach the domain separator. viem derives
 * `EIP712Domain` from the keys present on `domain`, unless the dApp declares
 * the type itself -- in which case a field can sit in `domain`, read as
 * official, and never be signed.
 */
export function signedDomainFields(
  domain: unknown,
  types: unknown,
): Set<string> {
  const declared = isRecord(types) ? types.EIP712Domain : undefined
  if (Array.isArray(declared)) {
    return new Set(declared.filter(isField).map(field => field.name))
  }

  const record = isRecord(domain) ? domain : {}
  return new Set(DOMAIN_FIELDS.filter(name => record[name] !== undefined))
}

/**
 * Validates the EIP-712 payload against what
 * `wallet.account.ethereum.signTypedData` accepts. Every rejection here is one
 * the dApp would otherwise get as an opaque `-32603` from zod or from viem,
 * after the user had already been shown a popup.
 *
 * Accepts the payload as a JSON string, which is what most dApps send, or as
 * an object, which wagmi and viem send.
 */
export function parseTypedData(value: unknown): TypedData {
  let raw = value

  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw)
    } catch {
      throw invalidParams('typed data is not valid JSON')
    }
  }

  if (!isRecord(raw)) {
    throw invalidParams('typed data must be an object')
  }

  const { domain, types, primaryType, message } = raw

  if (!isRecord(domain)) {
    throw invalidParams('typed data is missing a domain')
  }
  if (!isRecord(types)) {
    throw invalidParams('typed data is missing types')
  }
  if (typeof primaryType !== 'string' || !primaryType) {
    throw invalidParams('typed data is missing a primaryType')
  }
  if (!isRecord(message)) {
    throw invalidParams('typed data is missing a message')
  }

  const parsedTypes: Record<string, TypedDataField[]> = {}
  for (const [name, fields] of Object.entries(types)) {
    if (
      !Array.isArray(fields) ||
      !fields.every(
        field =>
          isRecord(field) &&
          typeof field.name === 'string' &&
          typeof field.type === 'string',
      )
    ) {
      throw invalidParams(`type ${name} is not a list of {name, type} fields`)
    }
    parsedTypes[name] = fields as TypedDataField[]
  }

  // viem throws when the primary type is not defined, which would reach the
  // dApp as -32603 after the user had already approved.
  if (!(primaryType in parsedTypes)) {
    throw invalidParams(`primaryType ${primaryType} is not defined in types`)
  }

  return { domain, types: parsedTypes, primaryType, message }
}

export function serializeTypedData(typedData: TypedData): string {
  const serialized = JSON.stringify(typedData)
  if (serialized.length > MAX_SERIALIZED_LENGTH) {
    throw invalidParams('typed data payload is too large')
  }
  return serialized
}

/**
 * `chainId` is optional in EIP-712 and dApps spell it as a number, a decimal
 * string or a hex string, so both sides are normalised and an absent value is
 * left alone.
 */
function parseDomainChainId(value: unknown): number | null {
  if (value === undefined || value === null) return null

  if (typeof value === 'number' || typeof value === 'bigint') {
    const asNumber = Number(value)
    if (!Number.isSafeInteger(asNumber)) {
      throw invalidParams('typed data declares an unreadable domain.chainId')
    }
    return asNumber
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const asNumber = /^0x/i.test(trimmed)
      ? Number.parseInt(trimmed, 16)
      : Number(trimmed)
    if (!Number.isSafeInteger(asNumber)) {
      throw invalidParams('typed data declares an unreadable domain.chainId')
    }
    return asNumber
  }

  throw invalidParams('typed data declares an unreadable domain.chainId')
}

/**
 * status-go does not check this. The domain is the only place the payload
 * names the chain it binds to, and a signature the user believes is for the
 * chain they are on but is not is a phishing shape worth closing.
 */
export function assertDomainChainId(
  { domain, types }: TypedData,
  originChainId: string,
): void {
  const declared = parseDomainChainId(domain.chainId)
  if (declared === null) return

  // A chainId the dApp leaves out of its own EIP712Domain is not in the
  // separator, so the signature binds to no chain at all while this check
  // reads as satisfied.
  if (!signedDomainFields(domain, types).has('chainId')) {
    throw invalidParams('typed data declares a chainId it does not sign')
  }

  const current = Number.parseInt(originChainId, 16)
  if (declared !== current) {
    throw invalidParams(
      `typed data is for chain ${declared}, but this dApp is connected to chain ${current}`,
    )
  }
}
