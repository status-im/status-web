---
id: 635
revision: '0'
language: en
title: Set up a view-only channel
---

:::info
Currently, you can only set up a view-only channel using Status desktop. [:octicons-desktop-download-16: Download Status desktop][status-web-download].
:::

In a view-only channel, everyone with access can view the conversation, but they can't respond or write in the channel. The community [owner or admin][permissions-by-role-in-status-communities] can designate certain people or groups to write in the view-only channel.

:::info
Members with view-only access to the channel can still [react][react-and-reply-to-messages] on the channel's messages.
:::

To learn how to use read-only channels in your community, check out [About view-only channels][about-view-only-channels].

## What to expect

- Community owners and admins can always view and write in the community channels, irrespective of the view-only permissions.
- You can configure view-only channels with or without tokens. Using tokens requires more steps, but provides more options. For example, [minting][mint-tokens-for-your-community] and [airdropping][how-to-airdrop-tokens-in-status] tokens can incentivize community engagement.
- When using tokens, [mint a community token][mint-tokens-for-your-community] and share the token with everyone you want to have view-only access.
- Once you set up the view-only permission, only members who meet its criteria can access the channel. However, their access is limited to read-only.
- Owners can set up [additional post permissions](#grant-someone-post-permissions-in-a-view-only-channel) in read-only channels for specific members.

## Set up a view-only channel without tokens

Using channel permissions, you can set up a view-only channel without tokens.

=== "Desktop"

    1. From the navigation sidebar, click your community.
    1. On top of the channels sidebar, click your community logo and then, click **Permissions**.
    1. Click **Add permission**.
    1. Turn off the `Who holds` to disable the token requirement.
    1. For the `Is allowed to` variable, select :desktop-read: **View only**.
    1. For the `In` variable, select the channel you want to set as read-only.
    1. Click **Create permission**.

## Set up a view-only channel with token-based permissions

Depending on your community's needs, you may want the view-only channel permission linked to a token. You can use an existing token (such as SNT or DAI, for example), or [a token you mint][mint-tokens-for-your-community] for the community.

If you mint a [collectible][collectibles-your-quick-start-guide] to manage the view-only access, enable the `Non-transferable (Soulbound)` and `Remotely-destruct` options to maintain control of who has view-only access to the channel. For more information, check out the [available collectible options][set-up-collectible-options].

=== "Desktop"

    1. From the navigation sidebar, click your community.
    1. On top of the channel sidebar, click your community logo and then, click **Permissions**.
    1. Click **Add permission**.
    1. For the `Who holds`, `Is allowed to` and `In` variables, click :desktop-plus: **Add** next to the variable and use the table below for reference.
    1. Click **Create permission**.

    | Variable | Steps |
    |:--|:--|
    | `Who holds` | 1. Select **Assets** or **Collectibles**.<br/>2. Choose the asset or collectible, and the amount you want to use to enable read-only access.<br/>3. Alternatively, **Import existing collectible**.<br/>4. Click **Add**. |
    | `Is allowed to` | :desktop-view: `View only` |
    | `In` | Choose the channel you want to set as read-only. |

:::tip
Optionally, check :desktop-hide: **Hide permission** to hide this permission from members who don't meet the requirements.
:::

## Grant someone post permissions in a view-only channel

If you want someone else to post content in a view-only channel, configure this person's `View and post` permission. For information on configuring channel permissions, check out [Set up channel permissions][set-up-channel-permissions].
