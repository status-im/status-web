---
id: 604
revision: '0'
language: en
title: Common issues when the community control node is offline
---

When you [create a community](./create-a-status-community.md), your computer becomes a [control node](./about-the-control-node-in-status-communities.md). As the community owner, the control node runs automatically in your Status desktop app if you use the same profile and computer where you set up the community.

:::info
You can [set up a new control node](./replace-your-community-s-control-node.md) if the initial Status desktop fails or becomes inaccessible.
:::

If you don't have the Status desktop app running and connected to the internet, your community keeps working, but your members' experience degrades. Here are some of the problems you and your members may find:

- Members can't access messages over one month because the [Community History Service](./about-the-community-history-service.md) is not running.
- [Community join requests](./manage-community-join-requests.md) can't be processed and are rejected or ignored.
- [Banning or kicking out members](./kick-or-ban-someone-from-your-community.md) is delayed until the control node is online.
- Your community can't verify if members in [token-gated channels](./set-up-channel-permissions.md) still hold the required tokens.
- Members who could not access a private channel for not [meeting the requirements](./understand-token-requirements-in-channels.md) can't join the channel even if they meet them now.

:::tip
Keep the Status desktop app working as the [community control node](./about-the-control-node-in-status-communities.md) online every day or at least once every six days.
:::
