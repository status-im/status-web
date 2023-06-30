---
id: 356
revision: '0'
language: en
title: About the Community History Service
---

:::info
Currently, you can only configure and benefit from the community history service using Status desktop. [:octicons-desktop-download-16: Download Status desktop](https://status.im/get).
:::

Status uses a [peer-to-peer network](../messaging-and-web3-browser/about-status-messages#peer-to-peer-messaging.md) to temporarily store your community messages for 30 days. When your community members get online, messages are automatically downloaded and stored locally on their computers.

The peer-to-peer network deletes messages older than 30 days, so members who don't receive them in time can't access them. With the Community History Service (CHS), every community member can access all historical messages.

## The basics

- The Status mobile app doesn't support the CHS.
- The CHS is on by default, but community owners can [turn it off](./turn-off-the-community-history-service.md). Other community members can't turn it off or choose not to download historical messages.
- When new members join, they can immediately see messages from the past 30 days. However, it may take a few days for messages older than 30 days to appear.
- Messages are only readable after importing in Status. The messages in the archives are encrypted, and it's impossible to directly open the archives to read them.

:::info
Downloading and importing messages can take a long time. If messages of a period don't appear, wait a few days.
:::

## How the Community History Service works

The CHS uses BitTorrent, a communication protocol for decentralized data sharing, with a built-in BitTorrent client in the Status desktop. BitTorrent connects computers with IP addresses and transfers archives to every member's computer.

Every seven days, the CHS prompts your control node to create an archive for messages in the past seven days. Then BitTorrent clients in your and your community members' Status apps share the archive.

The CHS runs automatically in the background, you can't see its processes or notifications. You or your community members must be online with the Status desktop app running for the CHS to share, download or import archives.

:::info
Status can't access or manipulate your messages through the CHS. The archives are stored locally on your and your community members' computers.
:::

:::tip
To avoid exposing your IP address to other community members, use a VPN when running Status.
:::

## An example of the workflow

The following example demonstrates how a message archive is generated and how your community members Alice and Bob access it.

### Step 1: Your Status generates an archive

- [x] Your Status desktop running the control node is online.
- [x] The control node generates an archive.
- [x] The BitTorrent client in your Status app makes the archive sharable over a magnet link.

### Step 2: Community members read messages older than 30 days

- [x] Alice comes online, and the BitTorrent client in her Status app receives the magnet link.
- [x] Using the magnet link and your IP address, the BitTorrent client in Alice's Status app downloads the archive from your computer.
- [x] Alice's Status app processes the archive, and Alice can read the messages in the community interface.
- [x] Bob's online, and his Status app downloads the archive from your or Alice's computer.

## Maintain the availability

The CHS archives messages only from the computer that runs the control node. If you miss any messages, your members can't receive a copy via the CHS. To provide a complete history, keep your control node online every day or at least once every six days.

Don't remove or edit torrent files, as they're part of the CHS mechanism.

If you [move your control node](./restore-your-status-community.md) from one computer to another, copy the Status folder to the new computer to keep the existing archives accessible.

:::tip
[Turning off the CHS](./turn-off-the-community-history-service.md) significantly reduces community members' experience. Keep it on unless it's really necessary.
:::

\*[magnet link]: A magnet link is a hyperlink containing information needed for downloading data in a peer-to-peer network, like the filename and download sources.
