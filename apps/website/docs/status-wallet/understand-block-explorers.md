---
id: 467
revision: '0'
language: en
title: Understand block explorers
---

Block explorers are tools you can use to browse blockchain data. With block explorers, you can learn more about any transaction that was made on the blockchain.

Since all Ethereum blockchain data is public and pseudonymous, it doesn't matter whose transactions you're exploring. You can view the details of both your own and others' transactions.

Block explorers are network-specific. This means that for [bridge transactions][crypto-bridging-your-quick-start-guide], you need to use two or more different block explorers, one for each chain. In your Status Wallet, you can find the Bridge field and transaction hashes for each chain. For more details, check out [Understand your transaction details][understand-your-transaction-details].

## Use block explorers

:::tip
For details on where find your Status Wallet address, check out [Receive crypto][receive-crypto].
:::

To get started with block explorers, copy your Status Wallet address and look it up on a block explorer of your choice. For example, you can use [Etherscan][etherscan], [Blockchair][blockchair] or [beaconcha.in][beaconchain] for the Ethereum mainnet. If you're using [an L2 or a sidechain][understand-l2s-and-sidechains], you need to find a block explorer for this network.

## Explore transaction data

You can usually find the data below on all block explorers. This list isn't comprehensive. For more details, check out your block explorer's documentation.

### Basic data

:::tip
To view your transaction details in your Status Wallet, go to the Wallet home screen and click or tap the transaction you're interested in.
:::

| Field              | Description                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Transaction hash   | Your transaction's unique ID.                                                                                                                                                   |
| Status             | Your transaction's status: for example, processing or completed. For more details on each status, check out [Understand transaction statuses][understand-transaction-statuses]. |
| From               | The address this transaction was sent from.                                                                                                                                     |
| To                 | The address this transaction was sent to.                                                                                                                                       |
| Block              | The block your transaction was added to. Blocks are structures within the blockchain. Each block has a unique ID and includes multiple transactions.                            |
| Value              | The total ETH value that is transferred.                                                                                                                                        |
| Tokens transferred | A list of tokens that are transferred in this transaction, if any.                                                                                                              |
| Timestamp          | The date and time at which your transaction was completed.                                                                                                                      |
| Transaction fee    | The [network fee][understand-network-fees] that was charged for your transaction.                                                                                               |

### Advanced data

| Field         | Description                                                                                                                                                                                                                                                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nonce         | The transaction number for the `from` address. The first transaction for each address has a nonce of 0. You can use nonces to cancel or resend transactions that are still processing. For more details, check out [Cancel transactions][cancel-transactions] and [Handle pending or stuck transactions][handle-pending-or-stuck-transactions]. |
| Gas price     | Cost per [unit of gas for this transaction][understand-network-fees], in gwei.                                                                                                                                                                                                                                                                  |
| Confirmations | The [number of confirmations][understand-confirmations] this transaction currently has.                                                                                                                                                                                                                                                         |
