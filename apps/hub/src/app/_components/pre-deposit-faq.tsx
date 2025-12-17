import { Accordion, type AccordionItem } from './accordion'

const ITEMS: AccordionItem[] = [
  {
    title: 'When will deposits be unlocked?',
    content:
      'Pre-deposits will be unlocked once bridged to Status Network Mainnet. Upon withdrawal, you will be able to stake and/or lock SNT in staking vaults on the L2. You will have the flexibility to create up to 20 separate vaults, each with customizable parameters including staking duration and corresponding reward multipliers. For all bridged tokens (including LINEA, ETH and GUSD at launch), you will be able to select which apps to provide liquidity to and continue to earn incentives.',
  },
  {
    title: 'Why am I receiving a wallet warning when trying to deposit?',
    content:
      'This warning may indicate insufficient ETH on your source chain to pay for gas fees. Ensure you have enough Linea L2 ETH available when depositing LINEA tokens, or Ethereum L1 ETH for other deposit types. It’s to solve this gas friction that we’re launching Status Network - the first natively gasless L2.',
  },
  {
    title: 'What are the total incentive rewards for pre-depositors?',
    content:
      'A liquid reward pool of 15M SNT and 20M LINEA tokens will be available for pre-depositors across vaults. The final allocation of liquid incentives and Karma will be based on vaults TVL and time in the vaults + potential multipliers for activity on testnets v1 and v2.',
  },
]

const PreDepositFaq = () => {
  return <Accordion items={ITEMS} />
}

export { PreDepositFaq }
