---
id: 311
revision: '0'
language: en
title: Back up your community's private key
---

:::info
Currently, you can only back up your community key using [Status desktop](../getting-started/#download-status.md).
:::

When you create a [Status Community](./about-status-communities.md), the Status app generates a public and a private cryptographic key (a key pair). In essence, these keys are very large numbers securely stored on your device and protected by your Status password.

The community's private key provides control over your community's settings, membership approvals and other important aspects of its operation. Use your community's private key backup to [restore the community](./restore-your-status-community.md) onto another device or to [transfer your community's ownership](./transfer-your-community-s-ownership.md) to someone else.

:::warn
Manually transferring your community from one computer to another by copying the private key is an insecure method of handling a private key. Still, it's currently the only way to do so.
We're aware of this issue and plan to implement a secure solution in a future release. In the meantime, be extra cautious when handling your community key and keep it safe.
:::

## What to expect

- As a community owner, you're responsible for backing up your community's private key and keeping it safe. Status doesn't have access to this key and can't recover it for you.
- Anyone with access to your community's private key may become the owner of the community and control its settings, permissions and membership approvals.
- Even with your community's private key, your community may disappear irretrievably if [you delete it](./delete-your-status-community.md) or the owner's node is offline for more than 30 days without activity.

## Back up your community key

=== "Desktop"

    1. From the navigation sidebar, click your community.
    1. At the top of the channel sidebar, click your community logo and then, click :desktop-overview: **Overview**.
    1. In the **Back up community key** area, click :desktop-back-up: **Back up**.
    1. In the pop-up window showing your community's private key, click **Copy**.
    1. Close the window showing the key. You can access this information at any time.
    1. Paste the community's private key on a document or write it down on paper.

:::info
Keep your community's private key safe. Status will never ask you for this information, and anyone who does is trying to steal your community.
:::

## Common questions

### Where is my community information backed up?

Your community configuration and messages for up to 30 days are cached in the Waku [peer-to-peer network](../messaging-and-web3-browser/about-status-messages#peer-to-peer-messaging.md). The community's private key represents proof of ownership but doesn't store the community configuration and messages.

### How frequently should I back up the community's private key?

You only need to back up your community's private key once, as long as you don't lose it. You can create the backup right after you [create the community](./create-a-status-community.md).

### How can I protect my community's private key?

To minimize the risk of unauthorized access to your community's private key, avoid keeping online copies or screenshots of it and maintain at least one pen-and-paper backup.
