---
id: 558
revision: '0'
language: en
title: Permissions by role in Status Communities
---

Status Communities have distinct roles, each with unique permissions and access levels.

## Permissions for key features

Refer to this table for the Status Communities permissions by role type.

| Action                                                                                                                                                           | Owner            | Admin            | Member           |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :--------------- | :--------------- |
| [Send messages](../messaging-and-web3-browser/send-and-read-messages.md), [react or reply to messages](../messaging-and-web3-browser/react-and-reply-to-messages.md), [edit or delete own messages](../messaging-and-web3-browser/edit-and-delete-your-messages.md) | :material-check: | :material-check: | :material-check: |
| [Mention someone, use global mentions](../messaging-and-web3-browser/use-mentions-in-status.md)                                                                                                   | :material-check: | :material-check: | :material-check: |
| [Send images](../messaging-and-web3-browser/share-images-in-status.md), [GIFs and stickers](../messaging-and-web3-browser/send-gifs-and-stickers.md)                                                                               | :material-check: | :material-check: | :material-check: |
| [Block someone](../your-profile-and-preferences/block-or-unblock-someone-in-status.md)                                                                                                              | :material-check: | :material-check: | :material-check: |
| [Access the community administration screens and functions](./getting-started-for-community-owners.md)                                                                | :material-check: | :material-check: |                  |
| [Edit community settings](./customize-your-community.md)                                                                                                              | :material-check: | :material-check: |                  |
| [Create](./create-a-channel.md), [edit](./customize-your-channel.md) and [delete channels or categories](./delete-a-channel.md)                                                 | :material-check: | :material-check: |                  |
| [Reorder channels and categories](./customize-your-channel.md)                                                                                                        | :material-check: | :material-check: |                  |
| [Create, edit and delete `Become member` permissions](./set-up-a-private-community.md)                                                                                | :material-check: | :material-check: |                  |
| [Create, edit and delete `Become admin` permissions](./delegate-admin-functions-to-community-members.md)                                                              | :material-check: |                  |                  |
| [Create, edit and delete other permissions](./set-up-your-community-permissions.md)                                                                                   | :material-check: | :material-check: |                  |
| [Recieve `Request to join` notifications and ability to accept or reject requests](./manage-community-join-requests.md) :one:                                         | :material-check: | :material-check: |                  |
| [Kick and ban members](./kick-or-ban-someone-from-your-community.md) :one:                                                                                            | :material-check: | :material-check: |                  |
| [Delete any message in the community](../messaging-and-web3-browser/edit-and-delete-your-messages.md)                                                                                             | :material-check: | :material-check: |                  |
| Pin messages when [`Any member can pin a message` option](./customize-your-community.md) is checked                                                                   | :material-check: | :material-check: | :material-check: |
| Pin messages when [`Any member can pin a message` option](./customize-your-community.md) is unchecked                                                                 | :material-check: | :material-check: |                  |
| View community node statistics                                                                                                                                   | :material-check: | :material-check: |                  |
| [Mint tokens](./mint-tokens-for-your-community.md)                                                                                                                    | :material-check: |                  |                  |
| [Airdrop tokens](./how-to-airdrop-tokens-in-status.md)                                                                                                                | :material-check: |                  |                  |
| [Access the community's private key](./back-up-your-community-s-private-key.md) :two:                                                                                 | :material-check: |                  |                  |
| [Configure the Community History Service](./about-the-community-history-service.md)                                                                                   | :material-check: |                  |                  |

:one: If an admin [accepts a member request](./manage-community-join-requests.md) or removes a member by [kicking or banning them](./kick-or-ban-someone-from-your-community.md), the command is sent to the owner node for action. If the owner node is not online, it will take the required action the next time it comes online.

:two: Community owners have the option to [manage their community using multiple computers](../manage-your-community-from-different-computers.md). For instance, they may use a laptop in addition to their desktop computer. If the owner manages the community from a computer without importing the community's private key, the key is not available on that computer.

:::info
To provide the best experience for their members, community owners should keep the Status desktop app online every day or at least once every six days.
:::
