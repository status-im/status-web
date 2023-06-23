---
id: 495
revision: '0'
language: en
title: Restore your Status Community
---

:::info
Currently, you can only restore your community using [Status desktop][download-status].
:::

If you lose access to the computer where you run your Status Community, you can restore the community onto another device using the community's private key. This process creates a new community node.

:::info
You can also use the community's private key to [transfer the community's ownership][transfer-your-community-s-ownership].
:::

The community's private key is a large string of characters stored in the Status app and protected by your Status password. Anyone with access to this key may become the community owner and control its settings, permissions and membership approvals.

:::warn
Manually transferring your community from one computer to another by copying the private key is an insecure method of handling a private key. Still, it's currently the only way to do so.<br/>
We're aware of this issue and plan to implement a secure solution in a future release. In the meantime, be extra cautious when handling your community key and keep it safe.
:::

## What to expect

- The community's private key represents proof of ownership but doesn't store the community configuration and messages. Your community configuration and messages are stored in the Waku [peer-to-peer network][peer-to-peer-messaging].
- When you [delete your Status Community][delete-your-status-community], all the community messages and settings are irretrievably lost, even if you have the community's private key.
- If you want to manage your community from multiple computers, don't restore the community using the private key. Instead, [set up additional computers][manage-your-community-from-different-computers] to manage your community.

## Restore your community

To restore your Status Community, you need to back up your private community key first. For instructions, read [Back up your community's private key][back-up-your-community-s-private-key]. To [transfer your community's ownership][transfer-your-community-s-ownership], ask the new owner to complete these steps on their computer using their Status profile.

=== "Desktop"

    1. From the navigation sidebar, click :desktop-communities: **Communities**.
    1. On top of the content area, click **Import using key**.
    1. Enter your community's private key in the **Community key** field.
    1. Click **Import**. If the **Import** option is unavailable, verify you're entering the correct key.

:::info
Status will never ask you for the community's private key, and anyone who does is trying to steal your community.
:::
