// const development = {
//   infura: {
//     5: 'https://goerli.infura.io/v3/',
//     11155111: 'https://sepolia.infura.io/v3/',
//     420: 'https://optimism-sepolia.infura.io/v3',
//     // 11155420: 'https://optimism-goerli.infura.io/v3'
//     // 421613: 'https://arbitrum-goerli.infura.io/v3/',
//     421614: 'https://arbitrum-sepolia.infura.io/v3/',
//   },
// }

const production = {
  infura: {
    1: 'https://mainnet.infura.io/v3/',
    10: 'https://optimism-mainnet.infura.io/v3/',
    42161: 'https://arbitrum-mainnet.infura.io/v3/',
  },
}

export const providers: Record<
  'development' | 'preview' | 'production',
  Record<string, Record<number, string>>
> = {
  development: production,
  preview: production,
  production,
}
