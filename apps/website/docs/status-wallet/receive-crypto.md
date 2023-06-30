---
id: 466
revision: '0'
language: en
title: Receive crypto
---

To receive crypto, you need to share your Ethereum address with the sender. As long as you only share your public address (which starts with `0x` and is 42 characters long), it's perfectly safe.

:::warn
You should never share your 12-word recovery phrase with anyone. Anyone who has your recovery phrase can manage your crypto. If someone's asking for your recovery phrase to send you crypto, they're trying to scam you.
:::

## Find your address

=== "Mobile"

    1. From the tab bar, tap :mobile-wallet: **Wallet**.
    1. From the top navigation, tap :mobile-qr-code: **View address**.
    1. Choose either your legacy or multi-chain address. For your multi-chain address, tap :desktop-edit: **Edit** to choose which chains you want your multi-chain address to feature.
    1. To copy your address, tap :mobile-copy: **Copy**. You can also ask the sender to scan the QR code of your address.

=== "Desktop"

    1. From the navigation sidebar, click :desktop-wallet: **Wallet**.
    1. Click :desktop-receive: **Receive**.
    1. Choose either your legacy or multi-chain address. For your multi-chain address, click :desktop-edit: **Edit** to choose which chains you want your multi-chain address to feature.
    1. To copy your address, click :desktop-copy: **Copy address**.

## Your legacy and multi-chain addresses

In essence, your legacy and multi-chain addresses are the same address. If you're only interested in the Ethereum mainnet, you can safely use your legacy address.

The key difference between your legacy and multi-chain addresses is that your multi-chain address lists the blockchain networks you want to receive crypto on. This means that if you're using any [layer-2 solutions or sidechains](./understand-l2s-and-sidechains.md), your multi-chain address can help signal which chains you prefer.

:::note
To use your multi-chain address, the sender needs to use a wallet app that supports multi-chain addresses. Status Wallet does this by default.
:::

For example, if you're using Ethereum mainnet and Optimism but not Arbitrum, your multi-chain address can show that preference. To add this to your address, go to Wallet > Receive > Multi-chain address > :desktop-edit: Edit (Wallet > View Address > Multi-chain address > :mobile-edit: Edit on mobile). From there, check the boxes next to the chains you want to use. The unselected chains do not show up in your address. This lets the sender know you don't want to receive crypto on those chains.

## What to do if you didn't receive your crypto

If someone sent you crypto and you can't see it in your Status Wallet, here's what you can do:

- Ask the sender to share a [block explorer](./understand-block-explorers.md) link for this transaction with you. Using the link, make sure they sent your crypto to the right address. If the transaction shows up as [processing](./understand-transaction-statuses.md) on the block explorer, simply wait until it's completed. This can take longer than usual when the network's busy.
- Close and re-open your Status Wallet app.
- Check your internet connection. If you're using a third-party VPN, try turning it off and on again.
