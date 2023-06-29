---
id: 541
revision: '0'
language: en
title: Mint tokens for your community
---

:::info
Currently, you can only mint tokens using the Status desktop app. [:octicons-desktop-download-16: Download Status desktop][status-web-download].
:::

With Status, you can mint custom tokens as a community owner. You have complete control over your token creation and distribution.

Your token's purpose and use are specific to your community. For example, you can reward your entire community or individual members with custom tokens, or offer [exclusive membership to token holders][grant-exclusive-access-with-tokens]. After minting your tokens, you can distribute them to community members and other users of Status via [airdrops][how-to-airdrop-tokens-in-Status].

:::info
Currently, you can only mint collectibles.
:::

When you mint a token, you create a new and unique digital asset in the blockchain network. The blockchain charges you a transaction fee for this process. Fore more details about blockchain fees, check out [Understand network fees][understand-network-fees].

## What to expect

- Community tokens you mint belong to your community and depend on it. This is why they don't appear in your [Status Wallet][status-wallet-your-quick-start-guide] once you mint them on your community's behalf, but you can [airdrop][how-to-airdrop-tokens-in-Status] them to your or any other address.
- Create an admin token using the `Not transferable (Soulbound)` and `Remote self-destruct` options. For more information, check out [Delegate admin functions to community members][delegate-admin-functions-to-community-members].
- In addition to the native Ethereum network (mainnet), Status supports the Optimism and Arbitrum [layer-2 scaling solutions][layer-2-scaling-solutions-for-ethereum] to mint tokens. These scaling solutions provide faster and cheaper transactions than mainnet.
- If you [delete your community][delete-your-status-community], you lose the metadata associated with your tokens, including the image and description.

:::tip
Minting a token is an on-chain transaction. The record of your token persists in the blockchain after you delete the community.
:::

## Mint a collectible

=== "Desktop"

    1. From the navigation sidebar, click your community.
    1. At the top of the channel sidebar, click your community logo and then, click :desktop-token: **Mint tokens**.
    1. Click **Create new token**.
    1. Customize your collectible by adding its artwork, name and description.
    1. Set up your [collectible options](#set-up-collectible-options).
    1. Click **Preview** to review your new token description and settings and then, click **Mint**.
    1. Review the transaction and fees and click :desktop-password: **Sign transaction**.

:::info
You can't change the collectible description or options after minting.
:::

## Set up collectible options

| Setting                      | Description                                                                                                                                                                                               |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token symbol                 | Choose up to four words to identify your token. Tokens minted by the same community can't have the same symbol.                                                                                           |
| Account                      | Select the wallet account you want to use to mint the token and pay the transaction fees.                                                                                                                 |
| Network                      | Choose the Ethereum mainnet or your preferred layer-2 network to mint your token. You can choose between Optimism and Arbitrum layer-2 networks. <br/> Layer-2 networks commonly have lower network fees. |
| Unlimited supply             | Turn on this option to create an unlimited number of tokens. If you choose this option, you can't [burn your token][burn-your-community-tokens] after minting.                                            |
| Total finity supply          | The total number of tokens that can be produced or minted. After minting the token, you can reduce this number by [burning the token][burn-your-community-tokens].                                        |
| Not transferable (Soulbound) | If you turn on this option, the token becomes locked to the first wallet address it is sent to, and can't be transfer to another address.                                                                 |
| Remote self-destruct         | When you turn on this option, you can destroy the token and make it unusable, even after you transfer it to others.                                                                                       |
