---
id: 538
revision: '0'
language: en
title: Delete your Status Community
---

:::info
Currently, you can only delete your community using Status desktop.
:::

Status uses a [peer-to-peer network][peer-to-peer-messaging] that temporarily stores data of your community. Because of this decentralized architecture, there is no one-click way to delete a community and all associated data.

## What to expect

- For a community to disappear, you must remove everyone from the community, including yourself, and make sure no activity happens for 30 days.
- Community data recorded on the blockchain continues to exist. For example, if you [minted tokens for your community][mint-tokens-for-your-community], the transaction is on-chain and persists in the blockchain.

:::info
Your messages are not in the blockchain and are not transported through the Ethereum network. [Messages][about-status-messages] are temporarily stored in the peer-to-peer network.
:::

## Delete your Status Community

You must complete the following tasks:

- [x] Set up [manual approval][manage-community-join-requests] for the community.
- [x] [Kick out all members from the community][kick-or-ban-someone-from-your-community].
- [x] [Leave your community][leave-a-status-community].
- [x] Delete or destroy the community's private key if it's stored anywhere.
- [x] Wait 30 days.

After 30 days, the Waku peer-to-peer network stops caching your community data, and the community is deleted irrecoverably.
