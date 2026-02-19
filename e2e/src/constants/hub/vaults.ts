export const TEST_VAULTS = {
  WETH: {
    id: 'WETH',
    name: 'WETH vault',
    token: 'WETH',
    address: '0xc71Ec84Ee70a54000dB3370807bfAF4309a67a1f',
    chainId: 1,
  },
  SNT: {
    id: 'SNT',
    name: 'SNT Vault',
    token: 'SNT',
    address: '0x493957E168aCCdDdf849913C3d60988c652935Cd',
    chainId: 1,
  },
  LINEA: {
    id: 'LINEA',
    name: 'LINEA Vault',
    token: 'LINEA',
    address: '0xb223cA53A53A5931426b601Fa01ED2425D8540fB',
    chainId: 59144,
  },
  GUSD: {
    id: 'GUSD',
    name: 'GUSD Vault',
    token: 'GUSD',
    address: '0x79B4cDb14A31E8B0e21C0120C409Ac14Af35f919',
    chainId: 1,
  },
} as const;

export const TEST_AMOUNTS = {
  SMALL_DEPOSIT: '0.001',
  MEDIUM_DEPOSIT: '0.01',
  LARGE_DEPOSIT: '0.1',
  STAKE_AMOUNT: '100',
} as const;
