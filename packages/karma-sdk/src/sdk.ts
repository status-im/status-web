import { buildPublicClient, buildWalletClient } from './client/client-factory'
import { CHAIN_PRESETS } from './contracts/addresses'
import { KarmaApiClient } from './api/client'
import { KarmaModule } from './modules/karma'
import { StatusKarmaDistributor } from './modules/status-rewards'
import { TiersModule } from './modules/tiers'
import { AirdropModule } from './modules/airdrop'
import { SybilModule } from './modules/sybil'
import {
  verifyMessage,
  getSession,
  signOut,
  getCurrentUser,
  getQuota,
  createSiweAuthHandlers,
} from './api/auth'
import { getPowCaptchaEndpoint, isValidCaptchaToken } from './api/captcha'

import type { PublicClient, WalletClient } from 'viem'
import type { KarmaSDKConfig, ChainConfig } from './types/config'
import type { CurrentUser, QuotaResponse, SiweSession } from './types'

const DEFAULT_API_URLS: Record<string, string> = {
  'sn-hoodi': 'https://karma.hoodi.status.network',
  'sn-mainnet': 'https://karma.status.network',
}

export class KarmaSDK {
  private _publicClient: PublicClient
  private _walletClient: WalletClient | null
  private _apiClient: KarmaApiClient
  private _chainConfig: ChainConfig

  readonly karma: KarmaModule
  readonly rewards: StatusKarmaDistributor
  readonly tiers: TiersModule
  readonly airdrop: AirdropModule
  readonly sybil: SybilModule
  readonly auth: AuthNamespace

  constructor(config: KarmaSDKConfig) {
    if (config.chain === 'custom') {
      if (!config.customChain) {
        throw new Error("customChain is required when chain is 'custom'")
      }
      this._chainConfig = config.customChain
    } else {
      const preset = CHAIN_PRESETS[config.chain]
      if (!preset) {
        throw new Error(`Unknown chain preset: ${config.chain}`)
      }
      this._chainConfig = preset
    }

    this._publicClient = buildPublicClient(config, this._chainConfig)
    this._walletClient = buildWalletClient(config, this._chainConfig)

    const apiUrl =
      config.apiUrl ??
      (config.chain !== 'custom'
        ? DEFAULT_API_URLS[config.chain]
        : undefined)
    if (!apiUrl) {
      throw new Error(
        "apiUrl is required when chain is 'custom'",
      )
    }

    this._apiClient = new KarmaApiClient({
      baseUrl: apiUrl,
      fetch: config.fetch,
    })

    const getPublic = () => this._publicClient
    const getWallet = () => this._walletClient

    this.karma = new KarmaModule(getPublic, getWallet, this._chainConfig)
    this.rewards = new StatusKarmaDistributor(
      getPublic,
      getWallet,
      this._chainConfig.contracts.statusRewardsDistributor,
    )
    this.tiers = new TiersModule(getPublic, this._chainConfig)
    this.airdrop = new AirdropModule(getPublic, getWallet)
    this.sybil = new SybilModule(this._apiClient)
    this.auth = new AuthNamespace(this._apiClient)
  }

  get publicClient(): PublicClient {
    return this._publicClient
  }

  set publicClient(client: PublicClient) {
    this._publicClient = client
  }

  get walletClient(): WalletClient | null {
    return this._walletClient
  }

  set walletClient(client: WalletClient | null) {
    this._walletClient = client
  }

  get apiClient(): KarmaApiClient {
    return this._apiClient
  }

  get chainConfig(): Readonly<ChainConfig> {
    return this._chainConfig
  }
}

class AuthNamespace {
  constructor(private apiClient: KarmaApiClient) {}

  async verifyMessage(params: {
    payload: string
    signature: string
  }): Promise<boolean> {
    return verifyMessage(this.apiClient, params)
  }

  async getSession(): Promise<SiweSession | null> {
    return getSession(this.apiClient)
  }

  async signOut(): Promise<boolean> {
    return signOut(this.apiClient)
  }

  async getCurrentUser(): Promise<CurrentUser> {
    return getCurrentUser(this.apiClient)
  }

  async getQuota(): Promise<QuotaResponse> {
    return getQuota(this.apiClient)
  }

  createSiweAuthHandlers(options?: {
    onAuthenticated?: () => void
    onSignedOut?: () => void
  }) {
    return createSiweAuthHandlers(this.apiClient, options)
  }

  getPowCaptchaEndpoint(): string {
    return getPowCaptchaEndpoint(this.apiClient['baseUrl'])
  }

  isValidCaptchaToken(token: unknown): token is string {
    return isValidCaptchaToken(token)
  }
}
