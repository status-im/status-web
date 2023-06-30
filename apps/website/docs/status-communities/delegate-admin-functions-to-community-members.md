---
id: 543
revision: '0'
language: en
title: Delegate admin functions to community members
---

:::info
Currently, you can only delegate admin functions using Status desktop. [:octicons-desktop-download-16: Download Status desktop](https://status.im/get).
:::

Community owners have total control over their communities, including settings, membership approvals and permissions. In addition, owners can delegate administrative functions to other community members through the [admin role](./permissions-by-role-in-status-communities.md). Admins play a similar role to owners, but with some important differences. Check out [Permissions by role in Status Communities](./permissions-by-role-in-status-communities.md) for more information.

To delegate admin functions to others, owners use [token-based community permissions](./set-up-your-community-permissions.md). Tokens are digital assets in a blockchain (such as the [Ethereum blockchain](../getting-started/about-the-ethereum-blockchain.md)), including assets (virtual coins), collectibles and ENS names.

## What to expect

- To delegate admin functions, assign the `Become admin` community permission to a collectible or ENS name owner.
- Using ENS names to delegate admin functions is more straightforward than using collectibles, but it requires the admin to own the ENS name.
- You can create a maximum of five different `Become admin` community-level permissions, but you can apply a single permission to multiple members.
- To stop delegating admin functions, [self-destruct the admin token](./self-destruct-a-token-remotely.md) or [delete the admin permission](./set-up-your-community-permissions#delete-community-permissions.md).

## Choose your delegation token

You can delegate [admin functions](./permissions-by-role-in-status-communities.md) to others using a collectible or an ENS name.

If you use a collectible, follow this process:

- [x] [Mint](./mint-tokens-for-your-community.md) a non-transferable (soulbound) and remotely-destructible collectible.
- [x] [Airdrop the collectible](./how-to-airdrop-tokens-in-status.md) to the person you wish to delegate admin functions to.
- [x] [Delegate the admin function](#delegate-admin-functions-using-collectibles-or-ens-names) using token-based community permissions.

Using ENS names, you don't need to mint and airdrop any token. You [delegate admin functions](#delegate-admin-functions-using-collectibles-or-ens-names) to a specific ENS name owner (such as alice.acme.eth) or a group of people under the same ENS domain (such as acme.eth).

:::info
Assets don't have the non-transferable (soulbound) and self-destructing properties collectibles have, making it harder to remove admin functions from other users. Avoid using assets to delegate admin functions.
:::

## Delegate admin functions using collectibles or ENS names

=== "Desktop"

    1. From the navigation sidebar, click your community.
    1. On top of the channel sidebar, click your community logo and then, click **Permissions**.
    1. Click **Add permission**.
    1. For the `Who holds` variable, choose your delegation option and use the table below for reference.
    1. For the `Is allowed to` variable, select :desktop-admin: **Become admin**.
    1. For the `In` variable, make sure your community is selected.
    1. Click **Create permission**. The new permission takes effect immediately.

    | Delegation option | Steps |
    |:---|:---|
    | Collectible | 1. Select **Collectibles**. |
    || 2. Choose the collectible and amount you want to use to delegate admin functions. |
    || 3. Alternatively, **Import existing collectible**. |
    || 4. Click **Add**. |
    | ENS name | 1. Select **ENS**.
    ||  2. Enter the ENS name or domain you want to delegate admin functions to. |
    || 3. Click **Add**. |

:::info
When you select the `Become admin` role, the **Hide permission** option is enabled automatically.
:::
