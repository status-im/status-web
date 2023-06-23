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
| [Send messages][send-and-read-messages], [react or reply to messages][react-and-reply-to-messages], [edit or delete own messages][edit-and-delete-your-messages] | :material-check: | :material-check: | :material-check: |
| [Mention someone, use global mentions][use-mentions-in-status]                                                                                                   | :material-check: | :material-check: | :material-check: |
| [Send images][share-images-in-status], [GIFs and stickers][send-gifs-and-stickers]                                                                               | :material-check: | :material-check: | :material-check: |
| [Block someone][block-or-unblock-someone-in-status]                                                                                                              | :material-check: | :material-check: | :material-check: |
| [Access the community administration screens and functions][getting-started-for-community-owners]                                                                | :material-check: | :material-check: |                  |
| [Edit community settings][customize-your-community]                                                                                                              | :material-check: | :material-check: |                  |
| [Create][create-a-channel], [edit][customize-your-channel] and [delete channels or categories][delete-a-channel]                                                 | :material-check: | :material-check: |                  |
| [Reorder channels and categories][customize-your-channel]                                                                                                        | :material-check: | :material-check: |                  |
| [Create, edit and delete `Become member` permissions][set-up-a-private-community]                                                                                | :material-check: | :material-check: |                  |
| [Create, edit and delete `Become admin` permissions][delegate-admin-functions-to-community-members]                                                              | :material-check: |                  |                  |
| [Create, edit and delete other permissions][set-up-your-community-permissions]                                                                                   | :material-check: | :material-check: |                  |
| [Recieve `Request to join` notifications and ability to accept or reject requests][manage-community-join-requests] :one:                                         | :material-check: | :material-check: |                  |
| [Kick and ban members][kick-or-ban-someone-from-your-community] :one:                                                                                            | :material-check: | :material-check: |                  |
| [Delete any message in the community][edit-and-delete-your-messages]                                                                                             | :material-check: | :material-check: |                  |
| Pin messages when [`Any member can pin a message` option][customize-your-community] is checked                                                                   | :material-check: | :material-check: | :material-check: |
| Pin messages when [`Any member can pin a message` option][customize-your-community] is unchecked                                                                 | :material-check: | :material-check: |                  |
| View community node statistics                                                                                                                                   | :material-check: | :material-check: |                  |
| [Mint tokens][mint-tokens-for-your-community]                                                                                                                    | :material-check: |                  |                  |
| [Airdrop tokens][how-to-airdrop-tokens-in-status]                                                                                                                | :material-check: |                  |                  |
| [Access the community's private key][back-up-your-community-s-private-key] :two:                                                                                 | :material-check: |                  |                  |
| [Configure the Community History Service][about-the-community-history-service]                                                                                   | :material-check: |                  |                  |

:one: If an admin [accepts a member request][manage-community-join-requests] or removes a member by [kicking or banning them][kick-or-ban-someone-from-your-community], the command is sent to the owner node for action. If the owner node is not online, it will take the required action the next time it comes online.

:two: Community owners have the option to [manage their community using multiple computers][manage-your-community-from-different-computers]. For instance, they may use a laptop in addition to their desktop computer. If the owner manages the community from a computer without importing the community's private key, the key is not available on that computer.

:::info
To provide the best experience for their members, community owners should keep the Status desktop app online every day or at least once every six days.
:::
