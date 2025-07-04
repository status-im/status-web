/**
 * @see https://github.com/status-im/status-go/pull/5953#discussion_r1804311422 for tokens Status is (not) using and why
 */

import * as fs from 'fs/promises'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { utf8ToBytes, bytesToHex } from 'ethereum-cryptography/utils'

const supportedNetworks = [
  42161, // Arbitrum
  10, // Optimism
  1, // Ethereum
  56, // BSC
  137, // Polygon
  8453, // Base
]

const standardTokenLists = [
  { name: 'Uniswap', url: 'https://gateway.ipfs.io/ipns/tokens.uniswap.org' },
  // may include lowercased addresses (e.g. 0x744d70fdbe2ba4cf95131626614a1763df805b9e instead of 0x744d70FDBE2Ba4CF95131626614a1763DF805B9E)
  {
    name: 'Optimism',
    url: 'https://static.optimism.io/optimism.tokenlist.json',
  },
  { name: 'Arbitrum', url: 'https://bridge.arbitrum.io/token-list-42161.json' },
  {
    name: 'CoinMarketCap',
    url: 'https://api.coinmarketcap.com/data-api/v3/uniswap/all.json',
  },
  // {
  //   name: 'Base',
  // },
  // {
  //   name: 'Polygon',
  // },
  // {
  //   name: 'BSC',
  // },
  {
    name: 'Aave',
    url: 'https://raw.githubusercontent.com/bgd-labs/aave-address-book/main/tokenlist.json',
  },
  {
    name: 'CoinGecko',
    url: 'https://tokens.coingecko.com/uniswap/all.json',
  },
  {
    name: 'Gemini',
    url: 'https://www.gemini.com/uniswap/manifest.json',
  },
]

// will assume non-checksummed addresses and always lowercase them
const statusTokenLists = [
  // 'https://raw.githubusercontent.com/status-im/status-go/develop/services/wallet/token/uniswap.go',
  // 'https://raw.githubusercontent.com/status-im/status-go/develop/services/wallet/token/tokenstore.go',
  'https://raw.githubusercontent.com/status-im/status-go/develop/services/wallet/token/token-lists/default-lists/uniswap.go',
  'https://raw.githubusercontent.com/status-im/status-go/develop/services/wallet/token/token-lists/default-lists/status.go',
  // 'https://raw.githubusercontent.com/status-im/status-go/develop/services/wallet/token/token-lists/default-lists/aave.go',
]

const outputFilePath = './src/constants/erc20.json'

function toChecksumAddress(address) {
  address = address.toLowerCase().replace('0x', '')
  const hash = bytesToHex(keccak256(utf8ToBytes(address)))
  let checksumAddress = '0x'

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksumAddress += address[i].toUpperCase()
    } else {
      checksumAddress += address[i]
    }
  }

  return checksumAddress
}

async function fetchStandardTokenList(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.tokens || data
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error)
    return []
  }
}

async function fetchStatusTokenLists(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    console.error(`Error fetching Go file from ${url}:`, error)
    return ''
  }
}

function parseGoFile(content) {
  const tokens = new Set()
  const regex = /"address":\s*"(0x[a-fA-F0-9]{40})"/g
  let match

  while ((match = regex.exec(content)) !== null) {
    tokens.add(match[1])
  }

  if (tokens.size === 0) {
    throw new Error('No tokens found')
  }

  return tokens
}

function compareTokens(standardTokens, goTokens) {
  const filteredTokens = []
  for (const goToken of goTokens) {
    const standardToken = standardTokens.find(
      token => token.address.toLowerCase() === goToken.toLowerCase(),
    )
    if (standardToken) {
      filteredTokens.push(standardToken)
    }
  }

  const missingTokens = standardTokens.filter(
    token => !goTokens.has(token.address.toLowerCase()),
  )

  return {
    filteredTokens: Array.from(
      new Map(filteredTokens.map(token => [token.address, token])).values(),
    ),
    missingTokens,
  }
}

function generateTemplate(tokens) {
  const tokenList = {
    $schema:
      'https://raw.githubusercontent.com/Uniswap/token-lists/v1.0.0-beta.32/src/tokenlist.schema.json',
    name: 'Status Portfolio ERC20 Token List',
    timestamp: new Date().toISOString(),
    version: {
      major: 1,
      minor: 0,
      patch: 0,
    },
    tokens: tokens.map(token => ({
      chainId: token.chainId,
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logoURI: token.logoURI,
      ...(token.extensions && { extensions: token.extensions }),
    })),
  }

  return JSON.stringify(tokenList, null, 2)
}

async function writeToFile(content, filePath) {
  try {
    await fs.writeFile(filePath, content, 'utf8')
    console.log(`File written to ${filePath}`)
  } catch (error) {
    console.error(`Error writing file to ${filePath}:`, error)
  }
}

function logDifferences(differences) {
  console.log('Token Lists Differences:')
  console.log('=======================')

  console.log(
    `  Combined standard tokens: ${differences.combinedStandardTokens.length}`,
  )
  console.log(
    `  Standard tokens listed by Status: ${differences.standardTokensListedByStatus.length}`,
  )
  console.log(
    `  Standard tokens used by Status (supported networks): ${differences.standardTokensUsedByStatus.length}`,
  )
  console.log(
    `  Standard tokens not listed by Status: ${differences.standardTokensNotListedByStatus.length}`,
  )
  console.log('  Some standard tokens not listed by Status:')
  differences.standardTokensNotListedByStatus.slice(0, 10).forEach(token => {
    console.log(
      `    - ${token.symbol} (${token.name}): ${token.address} (Chain: ${token.chainId})`,
    )
  })
  console.log(
    `  Standard tokens not used by Status: ${differences.standardTokensNotUsedByStatus.length}`,
  )
  console.log('  Some standard tokens not used by Status:')
  differences.standardTokensNotUsedByStatus.slice(0, 10).forEach(token => {
    console.log(
      `    - ${token.symbol} (${token.name}): ${token.address} (Chain: ${token.chainId})`,
    )
  })
  console.log()
}

function logDuplicateSymbols(tokensWithSameSymbol) {
  console.log('Tokens with same symbol:')
  console.log('=======================')

  console.log('  Some tokens with same symbol:')
  tokensWithSameSymbol.slice(0, 10).forEach(token => {
    console.log(
      `    - ${token.symbol} (${token.name}): ${token.address} (Chain: ${token.chainId})`,
    )
  })
  console.log()
}

async function main() {
  const statusTokens = new Set()
  for (const url of statusTokenLists) {
    const content = await fetchStatusTokenLists(url)
    const tokens = parseGoFile(content)
    tokens.forEach(token => statusTokens.add(token.toLowerCase()))
  }

  let standardTokens = new Map()
  for (const list of standardTokenLists) {
    const tokens = await fetchStandardTokenList(list.url)
    tokens.forEach(token => {
      const checksumAddress = toChecksumAddress(token.address)
      if (!standardTokens.has(checksumAddress)) {
        token.address = checksumAddress
        standardTokens.set(checksumAddress, token)
      }
    })
  }

  const combinedStandardTokens = Array.from(standardTokens.values())
  const {
    filteredTokens: standardTokensListedByStatus,
    missingTokens: standardTokensNotListedByStatus,
  } = compareTokens(combinedStandardTokens, statusTokens)

  const standardTokensUsedByStatus = standardTokensListedByStatus.filter(
    token => supportedNetworks.includes(token.chainId),
  )

  const standardTokensNotUsedByStatus = standardTokensNotListedByStatus.filter(
    token => supportedNetworks.includes(token.chainId),
  )

  const differences = {
    combinedStandardTokens,
    standardTokensListedByStatus,
    standardTokensUsedByStatus,
    standardTokensNotListedByStatus,
    standardTokensNotUsedByStatus,
  }

  const tokensWithSameSymbol = []
  const symbolMap = new Map()
  standardTokensUsedByStatus.forEach(token => {
    const tokenWithSameSymbol = symbolMap.get(token.symbol)
    if (tokenWithSameSymbol && tokenWithSameSymbol.chainId === token.chainId) {
      tokensWithSameSymbol.push(tokenWithSameSymbol)
    } else {
      symbolMap.set(token.symbol, [token])
    }
  })

  const templateContent = generateTemplate(standardTokensUsedByStatus)
  await writeToFile(templateContent, outputFilePath)

  logDifferences(differences)
  logDuplicateSymbols(tokensWithSameSymbol)
}

main()
