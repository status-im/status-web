export type legacy_TokenPriceHistoryResponseBody = {
  Response: string
  Message: string
  HasWarning: boolean
  Type: number
  RateLimit: Record<string, unknown>
  Data: {
    Aggregated: boolean
    TimeFrom: number
    TimeTo: number
    Data: Array<{
      time: number
      close: number
      high: number
      low: number
      open: number
      volumefrom: number
      volumeto: number
      conversionType: string
      conversionSymbol: string
    }>
  }
}

export type TokenMetadataResponseBody = {
  Data: {
    ID: number
    TYPE: string
    ID_LEGACY: number
    ID_PARENT_ASSET: number | null
    ID_ASSET_ISSUER: number
    SYMBOL: string
    URI: string
    ASSET_TYPE: string
    ASSET_ISSUER_NAME: string
    PARENT_ASSET_SYMBOL: string | null
    CREATED_ON: number
    UPDATED_ON: number
    PUBLIC_NOTICE: string | null
    NAME: string
    LOGO_URL: string
    LAUNCH_DATE: number
    PREVIOUS_ASSET_SYMBOLS: string | null
    ASSET_ALTERNATIVE_IDS: Array<{
      NAME: string
      ID: string | number
    }>
    ASSET_DESCRIPTION_SNIPPET: string
    ASSET_DECIMAL_POINTS: number
    SUPPORTED_PLATFORMS: Array<{
      BLOCKCHAIN: string
      TOKEN_STANDARD: string
      BRIDGE_OPERATOR: string
      IS_ASSET_ISSUER?: boolean
      EXPLORER_URL: string
      SMART_CONTRACT_ADDRESS: string
      LAUNCH_DATE?: number
      RETIRE_DATE?: number
      TRADING_AS: string
      DECIMALS: number
      IS_INHERITED: boolean
    }>
    ASSET_CUSTODIANS: Array<{
      NAME: string
    }>
    CONTROLLED_ADDRESSES: null
    ASSET_SECURITY_METRICS: Array<{
      NAME: string
      OVERALL_SCORE: number
      OVERALL_RANK: number
      UPDATED_AT: number
    }>
    SUPPLY_MAX: number
    SUPPLY_ISSUED: number
    SUPPLY_TOTAL: number
    SUPPLY_CIRCULATING: number
    SUPPLY_FUTURE: number
    SUPPLY_LOCKED: number
    SUPPLY_BURNT: number
    SUPPLY_STAKED: number
    LAST_BLOCK_MINT: number
    LAST_BLOCK_BURN: null
    BURN_ADDRESSES: Array<{
      NAME: string
      BLOCKCHAIN: string
      ADDRESS: string
      DESCRIPTION: string
    }>
    LOCKED_ADDRESSES: Array<{
      NAME: string
      BLOCKCHAIN: string
      ADDRESS: string
      DESCRIPTION: string
    }>
    HAS_SMART_CONTRACT_CAPABILITIES: boolean
    SMART_CONTRACT_SUPPORT_TYPE: string
    TARGET_BLOCK_MINT: number
    TARGET_BLOCK_TIME: number
    LAST_BLOCK_NUMBER: number
    LAST_BLOCK_TIMESTAMP: number
    LAST_BLOCK_TIME: number
    LAST_BLOCK_SIZE: number
    LAST_BLOCK_ISSUER: string
    LAST_BLOCK_TRANSACTION_FEE_TOTAL: number
    LAST_BLOCK_TRANSACTION_COUNT: number
    LAST_BLOCK_HASHES_PER_SECOND: number
    LAST_BLOCK_DIFFICULTY: number
    SUPPORTED_STANDARDS: Array<{
      NAME: string
    }>
    LAYER_TWO_SOLUTIONS: Array<{
      NAME: string
      WEBSITE_URL: string
      DESCRIPTION: string
      CATEGORY: string
    }>
    PRIVACY_SOLUTIONS: Array<{
      NAME: string
      WEBSITE_URL: string
      DESCRIPTION: string
      PRIVACY_SOLUTION_FEATURES?: Array<{
        NAME: string
      }>
    }>
    CODE_REPOSITORIES: Array<{
      URL: string
      MAKE_3RD_PARTY_REQUEST: boolean
      OPEN_ISSUES: number
      CLOSED_ISSUES: number
      OPEN_PULL_REQUESTS: number
      CLOSED_PULL_REQUESTS: number
      CONTRIBUTORS: number
      FORKS: number
      STARS: number
      SUBSCRIBERS: number
      LAST_UPDATED_TS: number
      CREATED_AT: number
      UPDATED_AT: number
      LAST_PUSH_TS: number
      CODE_SIZE_IN_BYTES: number
      IS_FORK: boolean
      LANGUAGE: string
      FORKED_ASSET_DATA: null
    }>
    SUBREDDITS: Array<{
      URL: string
      MAKE_3RD_PARTY_REQUEST: boolean
      NAME: string
      CURRENT_ACTIVE_USERS: number
      AVERAGE_POSTS_PER_DAY: number
      AVERAGE_POSTS_PER_HOUR: number
      AVERAGE_COMMENTS_PER_DAY: number
      AVERAGE_COMMENTS_PER_HOUR: number
      SUBSCRIBERS: number
      COMMUNITY_CREATED_AT: number
      LAST_UPDATED_TS: number
    }>
    TWITTER_ACCOUNTS: Array<{
      URL: string
      MAKE_3RD_PARTY_REQUEST: boolean
      NAME: string
      USERNAME: string
      VERIFIED: boolean
      VERIFIED_TYPE: string
      FOLLOWING: number
      FOLLOWERS: number
      FAVOURITES: number
      LISTS: number
      STATUSES: number
      ACCOUNT_CREATED_AT: number
      LAST_UPDATED_TS: number
    }>
    DISCORD_SERVERS: Array<{
      URL: string
      MAKE_3RD_PARTY_REQUEST: boolean
      NAME: string
      TOTAL_MEMBERS: number
      CURRENT_ACTIVE_USERS: number
      PREMIUM_SUBSCRIBERS: number
      LAST_UPDATED_TS: number
    }>
    TELEGRAM_GROUPS: null
    OTHER_SOCIAL_NETWORKS: Array<{
      NAME: string
      URL: string
    }>
    HELD_TOKEN_SALE: boolean
    TOKEN_SALES: Array<{
      TOKEN_SALE_TYPE: string
      TOKEN_SALE_DATE_START: number
      TOKEN_SALE_DATE_END: number
      TOKEN_SALE_DESCRIPTION: string
      TOKEN_SALE_TEAM_MEMBERS: Array<{
        TYPE: string
        FULL_NAME: string
      }>
      TOKEN_SALE_WEBSITE_URL: string
      TOKEN_SALE_SUPPLY: number
      TOKEN_SUPPLY_POST_SALE: string
      TOKEN_SALE_PAYMENT_METHOD_TYPE: string
      TOKEN_SALE_START_PRICE: number
      TOKEN_SALE_START_PRICE_CURRENCY: string
      TOKEN_SALE_FUNDS_RAISED: Array<{
        CURRENCY: string
        TOTAL_VALUE: number
      }>
      TOKEN_SALE_FUNDS_RAISED_USD: number
      TOKEN_SALE_INVESTORS_SPLIT: Array<{
        CATEGORY: string
        TOTAL_TOKENS: number
      }>
      TOKEN_SALE_RESERVE_SPLIT: Array<{
        CATEGORY: string
        TOTAL_TOKENS: number
      }>
      TOKEN_SALE_JURISDICTIONS: Array<{
        NAME: string
      }>
      TOKEN_SALE_REGULATORY_FRAMEWORKS: Array<{
        NAME: string
      }>
      TOKEN_SALE_LEGAL_ADVISERS: Array<{
        NAME: string
      }>
      TOKEN_SALE_LEGAL_FORMS: Array<{
        NAME: string
      }>
      TOKEN_SALE_SECURITY_AUDIT_COMPANIES: Array<{
        NAME: string
      }>
    }>
    HELD_EQUITY_SALE: boolean
    WEBSITE_URL: string
    BLOG_URL: string
    WHITE_PAPER_URL: string
    OTHER_DOCUMENT_URLS: Array<{
      TYPE: string
      VERSION?: number
      URL: string
      COMMENT?: string
    }>
    EXPLORER_ADDRESSES: Array<{
      URL: string
    }>
    RPC_OPERATORS: Array<{
      OPERATOR_NAME: string
      URL: string
      REQUIRES_API_KEY: boolean
      DOCUMENTATION_URL: string
      API_KEY_PARAMETER_LOCATION?: string
    }>
    IS_EXCLUDED_FROM_MKT_CAP_TOPLIST: null
    ASSET_INDUSTRIES: Array<{
      ASSET_INDUSTRY: string
      JUSTIFICATION: string
    }>
    CONSENSUS_MECHANISMS: Array<{
      NAME: string
    }>
    CONSENSUS_ALGORITHM_TYPES: Array<{
      NAME: string
      DESCRIPTION: string
    }>
    HASHING_ALGORITHM_TYPES: Array<{
      NAME: string
    }>
    PRICE_USD: number
    PRICE_USD_SOURCE: string
    PRICE_USD_LAST_UPDATE_TS: number
    MKT_CAP_PENALTY: number
    CIRCULATING_MKT_CAP_USD: number
    TOTAL_MKT_CAP_USD: number
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: number
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_DIRECT_USD: number
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_USD: number
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD: number
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: number
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_DIRECT_USD: number
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_USD: number
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: number
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: number
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_DIRECT_USD: number
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_USD: number
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: number
    SPOT_MOVING_24_HOUR_CHANGE_USD: number
    SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD: number
    SPOT_MOVING_7_DAY_CHANGE_USD: number
    SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_USD: number
    SPOT_MOVING_30_DAY_CHANGE_USD: number
    SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_USD: number
    TOPLIST_BASE_RANK: {
      CREATED_ON: number
      LAUNCH_DATE: number
      CIRCULATING_MKT_CAP_USD: number
      TOTAL_MKT_CAP_USD: number
      SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD: number
      SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: number
      SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: number
    }
    ASSET_DESCRIPTION: string
    ASSET_DESCRIPTION_SUMMARY: string
    PROJECT_LEADERS: Array<{
      LEADER_TYPE: string
      FULL_NAME: string
    }>
    ASSOCIATED_CONTACT_DETAILS: Array<{
      CONTACT_MEDIUM: string
      FULL_NAME: string
    }>
    SEO_TITLE: string
    SEO_DESCRIPTION: string
  }
}

export type deprecated_TokensMetadataResponseBody = {
  Response: string
  Message: string
  Data: {
    [symbol: string]: {
      ID: number
      TYPE: string
      ID_LEGACY: number
      ID_PARENT_ASSET: number | null
      ID_ASSET_ISSUER: number
      SYMBOL: string
      URI: string
      ASSET_TYPE: string
      ASSET_ISSUER_NAME: string
      PARENT_ASSET_SYMBOL: string | null
      CREATED_ON: number
      UPDATED_ON: number
      PUBLIC_NOTICE: string | null
      NAME: string
      LOGO_URL: string
      LAUNCH_DATE: number
      PREVIOUS_ASSET_SYMBOLS: string | null
      ASSET_ALTERNATIVE_IDS: Array<{
        NAME: string
        ID: string | number
      }>
      ASSET_DESCRIPTION_SNIPPET: string
      ASSET_DECIMAL_POINTS: number
      SUPPORTED_PLATFORMS: Array<{
        BLOCKCHAIN: string
        TOKEN_STANDARD: string
        BRIDGE_OPERATOR: string
        EXPLORER_URL: string
        SMART_CONTRACT_ADDRESS: string
        LAUNCH_DATE: number
        RETIRE_DATE?: number
        TRADING_AS: string
        DECIMALS: number
        IS_INHERITED: boolean
      }>
      ASSET_CUSTODIANS: Array<{
        NAME: string
      }>
      CONTROLLED_ADDRESSES: null
      ASSET_SECURITY_METRICS: Array<{
        NAME: string
        OVERALL_SCORE: number
        OVERALL_RANK: number
        UPDATED_AT: number
      }>
      SUPPLY_MAX: number
      SUPPLY_ISSUED: number
      SUPPLY_TOTAL: number
      SUPPLY_CIRCULATING: number
      SUPPLY_FUTURE: number
      SUPPLY_LOCKED: number
      SUPPLY_BURNT: number
      SUPPLY_STAKED: number
      LAST_BLOCK_MINT: number
      LAST_BLOCK_BURN: number | null
      BURN_ADDRESSES: Array<{
        NAME: string
        BLOCKCHAIN: string
        ADDRESS: string
        DESCRIPTION: string
      }>
      LOCKED_ADDRESSES: Array<{
        NAME: string
        BLOCKCHAIN: string
        ADDRESS: string
        DESCRIPTION: string
      }>
      HAS_SMART_CONTRACT_CAPABILITIES: boolean
      SMART_CONTRACT_SUPPORT_TYPE: string
      TARGET_BLOCK_MINT: number
      TARGET_BLOCK_TIME: number
      LAST_BLOCK_NUMBER: number
      LAST_BLOCK_TIMESTAMP: number
      LAST_BLOCK_TIME: number
      LAST_BLOCK_SIZE: number
      LAST_BLOCK_ISSUER: string
      LAST_BLOCK_TRANSACTION_FEE_TOTAL: number
      LAST_BLOCK_TRANSACTION_COUNT: number
      LAST_BLOCK_HASHES_PER_SECOND: number
      LAST_BLOCK_DIFFICULTY: number
      SUPPORTED_STANDARDS: Array<{
        NAME: string
      }>
      LAYER_TWO_SOLUTIONS: Array<{
        NAME: string
        WEBSITE_URL: string
        DESCRIPTION: string
        CATEGORY: string
      }>
      PRIVACY_SOLUTIONS: Array<{
        NAME: string
        WEBSITE_URL: string
        DESCRIPTION: string
        PRIVACY_SOLUTION_FEATURES?: Array<{
          NAME: string
        }>
      }>
      CODE_REPOSITORIES: Array<{
        URL: string
        MAKE_3RD_PARTY_REQUEST: boolean
        OPEN_ISSUES: number
        CLOSED_ISSUES: number
        OPEN_PULL_REQUESTS: number
        CLOSED_PULL_REQUESTS: number
        CONTRIBUTORS: number
        FORKS: number
        STARS: number
        SUBSCRIBERS: number
        LAST_UPDATED_TS: number
        CREATED_AT: number
        UPDATED_AT: number
        LAST_PUSH_TS: number
        CODE_SIZE_IN_BYTES: number
        IS_FORK: boolean
        LANGUAGE: string
        FORKED_ASSET_DATA: null
      }>
      SUBREDDITS: Array<{
        URL: string
        MAKE_3RD_PARTY_REQUEST: boolean
        NAME: string
        CURRENT_ACTIVE_USERS: number
        AVERAGE_POSTS_PER_DAY: number
        AVERAGE_POSTS_PER_HOUR: number
        AVERAGE_COMMENTS_PER_DAY: number
        AVERAGE_COMMENTS_PER_HOUR: number
        SUBSCRIBERS: number
        COMMUNITY_CREATED_AT: number
        LAST_UPDATED_TS: number
      }>
      TWITTER_ACCOUNTS: Array<{
        URL: string
        MAKE_3RD_PARTY_REQUEST: boolean
        NAME: string
        USERNAME: string
        VERIFIED: boolean
        VERIFIED_TYPE: string
        FOLLOWING: number
        FOLLOWERS: number
        FAVOURITES: number
        LISTS: number
        STATUSES: number
        ACCOUNT_CREATED_AT: number
        LAST_UPDATED_TS: number
      }>
      DISCORD_SERVERS: Array<{
        URL: string
        MAKE_3RD_PARTY_REQUEST: boolean
        NAME: string
        TOTAL_MEMBERS: number
        CURRENT_ACTIVE_USERS: number
        PREMIUM_SUBSCRIBERS: number
        LAST_UPDATED_TS: number
      }>
      TELEGRAM_GROUPS: null
      OTHER_SOCIAL_NETWORKS: Array<{
        NAME: string
        URL: string
      }>
      HELD_TOKEN_SALE: boolean
      TOKEN_SALES: Array<{
        TOKEN_SALE_TYPE: string
        TOKEN_SALE_DATE_START: number
        TOKEN_SALE_DATE_END: number
        TOKEN_SALE_DESCRIPTION: string
        TOKEN_SALE_TEAM_MEMBERS: Array<{
          TYPE: string
          FULL_NAME: string
        }>
        TOKEN_SALE_WEBSITE_URL: string
        TOKEN_SALE_SUPPLY: number
        TOKEN_SUPPLY_POST_SALE: string
        TOKEN_SALE_PAYMENT_METHOD_TYPE: string
        TOKEN_SALE_START_PRICE: number
        TOKEN_SALE_START_PRICE_CURRENCY: string
        TOKEN_SALE_FUNDS_RAISED: Array<{
          CURRENCY: string
          TOTAL_VALUE: number
        }>
        TOKEN_SALE_FUNDS_RAISED_USD: number
        TOKEN_SALE_INVESTORS_SPLIT: Array<{
          CATEGORY: string
          TOTAL_TOKENS: number
        }>
        TOKEN_SALE_RESERVE_SPLIT: Array<{
          CATEGORY: string
          TOTAL_TOKENS: number
        }>
        TOKEN_SALE_JURISDICTIONS: Array<{
          NAME: string
        }>
        TOKEN_SALE_REGULATORY_FRAMEWORKS: Array<{
          NAME: string
        }>
        TOKEN_SALE_LEGAL_ADVISERS: Array<{
          NAME: string
        }>
        TOKEN_SALE_LEGAL_FORMS: Array<{
          NAME: string
        }>
        TOKEN_SALE_SECURITY_AUDIT_COMPANIES: Array<{
          NAME: string
        }>
      }>
      HELD_EQUITY_SALE: boolean
      WEBSITE_URL: string
      BLOG_URL: string
      WHITE_PAPER_URL: string
      OTHER_DOCUMENT_URLS: Array<{
        TYPE: string
        VERSION?: number
        URL: string
        COMMENT?: string
      }>
      EXPLORER_ADDRESSES: Array<{
        URL: string
      }>
      RPC_OPERATORS: Array<{
        OPERATOR_NAME: string
        URL: string
        REQUIRES_API_KEY: boolean
        DOCUMENTATION_URL: string
        API_KEY_PARAMETER_LOCATION?: string
      }>
      IS_EXCLUDED_FROM_MKT_CAP_TOPLIST: null
      ASSET_INDUSTRIES: Array<{
        ASSET_INDUSTRY: string
        JUSTIFICATION: string
      }>
      CONSENSUS_MECHANISMS: Array<{
        NAME: string
      }>
      CONSENSUS_ALGORITHM_TYPES: Array<{
        NAME: string
        DESCRIPTION: string
      }>
      HASHING_ALGORITHM_TYPES: Array<{
        NAME: string
      }>
      PRICE_USD: number
      PRICE_USD_SOURCE: string
      PRICE_USD_LAST_UPDATE_TS: number
      MKT_CAP_PENALTY: number
      CIRCULATING_MKT_CAP_USD: number
      TOTAL_MKT_CAP_USD: number
      SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: number
      SPOT_MOVING_24_HOUR_QUOTE_VOLUME_DIRECT_USD: number
      SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_USD: number
      SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD: number
      SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: number
      SPOT_MOVING_7_DAY_QUOTE_VOLUME_DIRECT_USD: number
      SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_USD: number
      SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: number
      SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: number
      SPOT_MOVING_30_DAY_QUOTE_VOLUME_DIRECT_USD: number
      SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_USD: number
      SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: number
      SPOT_MOVING_24_HOUR_CHANGE_USD: number
      SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD: number
      SPOT_MOVING_7_DAY_CHANGE_USD: number
      SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_USD: number
      SPOT_MOVING_30_DAY_CHANGE_USD: number
      SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_USD: number
      TOPLIST_BASE_RANK: {
        CREATED_ON: number
        LAUNCH_DATE: number
        CIRCULATING_MKT_CAP_USD: number
        TOTAL_MKT_CAP_USD: number
        SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD: number
        SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: number
        SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: number
      }
      ASSET_DESCRIPTION: string
      ASSET_DESCRIPTION_SUMMARY: string
      PROJECT_LEADERS: Array<{
        LEADER_TYPE: string
        FULL_NAME: string
      }>
      ASSOCIATED_CONTACT_DETAILS: Array<{
        CONTACT_MEDIUM: string
        FULL_NAME: string
      }>
      SEO_TITLE: string
      SEO_DESCRIPTION: string
    }
  }
  Err: Record<string, unknown>
}

export type legacy_research_TokenMetadataResponseBody = {
  Response: string
  Message: string
  Data: {
    [symbol: string]: {
      Id: string
      Url: string
      ImageUrl: string
      ContentCreatedOn: number
      Name: string
      Symbol: string
      CoinName: string
      FullName: string
      Description: string
      AssetTokenStatus: string
      Algorithm: string
      ProofType: string
      SortOrder: string
      Sponsored: boolean
      Taxonomy: {
        Access: string
        FCA: string
        FINMA: string
        Industry: string
        CollateralizedAsset: string
        CollateralizedAssetType: string
        CollateralType: string
        CollateralInfo: string
      }
      Rating: {
        Weiss: {
          Rating: string
          TechnologyAdoptionRating: string
          MarketPerformanceRating: string
        }
      }
      IsTrading: boolean
      TotalCoinsMined: number
      CirculatingSupply: number
      BlockNumber: number
      NetHashesPerSecond: number
      BlockReward: number
      BlockTime: number
      AssetLaunchDate: string
      AssetWhitepaperUrl: string
      AssetWebsiteUrl: string
      MaxSupply: number
      MktCapPenalty: number
      IsUsedInDefi: number
      IsUsedInNft: number
      PlatformType: string
      DecimalPoints: number
      AlgorithmType: string
    }
  }
  RateLimit: Record<string, unknown>
  HasWarning: boolean
  Type: number
}

export type legacy_TokensPriceResponseBody = {
  RAW: {
    [symbol: string]: {
      EUR: {
        TYPE: string
        MARKET: string
        FROMSYMBOL: string
        TOSYMBOL: string
        FLAGS: string
        PRICE: number
        LASTUPDATE: number
        MEDIAN: number
        LASTVOLUME: number
        LASTVOLUMETO: number
        LASTTRADEID: string
        VOLUMEDAY: number
        VOLUMEDAYTO: number
        VOLUME24HOUR: number
        VOLUME24HOURTO: number
        OPENDAY: number
        HIGHDAY: number
        LOWDAY: number
        OPEN24HOUR: number
        HIGH24HOUR: number
        LOW24HOUR: number
        LASTMARKET: string
        VOLUMEHOUR: number
        VOLUMEHOURTO: number
        OPENHOUR: number
        HIGHHOUR: number
        LOWHOUR: number
        TOPTIERVOLUME24HOUR: number
        TOPTIERVOLUME24HOURTO: number
        CHANGE24HOUR: number
        CHANGEPCT24HOUR: number
        CHANGEDAY: number
        CHANGEPCTDAY: number
        CHANGEHOUR: number
        CHANGEPCTHOUR: number
        CONVERSIONTYPE: string
        CONVERSIONSYMBOL: string
        CONVERSIONLASTUPDATE: number
        SUPPLY: number
        MKTCAP: number
        MKTCAPPENALTY: number
        CIRCULATINGSUPPLY: number
        CIRCULATINGSUPPLYMKTCAP: number
        TOTALVOLUME24H: number
        TOTALVOLUME24HTO: number
        TOTALTOPTIERVOLUME24H: number
        TOTALTOPTIERVOLUME24HTO: number
        IMAGEURL: string
      }
    }
  }
  DISPLAY: {
    [symbol: string]: {
      EUR: {
        FROMSYMBOL: string
        TOSYMBOL: string
        MARKET: string
        PRICE: string
        LASTUPDATE: string
        LASTVOLUME: string
        LASTVOLUMETO: string
        LASTTRADEID: string
        VOLUMEDAY: string
        VOLUMEDAYTO: string
        VOLUME24HOUR: string
        VOLUME24HOURTO: string
        OPENDAY: string
        HIGHDAY: string
        LOWDAY: string
        OPEN24HOUR: string
        HIGH24HOUR: string
        LOW24HOUR: string
        LASTMARKET: string
        VOLUMEHOUR: string
        VOLUMEHOURTO: string
        OPENHOUR: string
        HIGHHOUR: string
        LOWHOUR: string
        TOPTIERVOLUME24HOUR: string
        TOPTIERVOLUME24HOURTO: string
        CHANGE24HOUR: string
        CHANGEPCT24HOUR: string
        CHANGEDAY: string
        CHANGEPCTDAY: string
        CHANGEHOUR: string
        CHANGEPCTHOUR: string
        CONVERSIONTYPE: string
        CONVERSIONSYMBOL: string
        CONVERSIONLASTUPDATE: string
        SUPPLY: string
        MKTCAP: string
        MKTCAPPENALTY: string
        CIRCULATINGSUPPLY: string
        CIRCULATINGSUPPLYMKTCAP: string
        TOTALVOLUME24H: string
        TOTALVOLUME24HTO: string
        TOTALTOPTIERVOLUME24H: string
        TOTALTOPTIERVOLUME24HTO: string
        IMAGEURL: string
      }
    }
  }
}
