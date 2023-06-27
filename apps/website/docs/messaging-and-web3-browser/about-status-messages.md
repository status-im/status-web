---
id: 125
revision: '0'
language: en
title: About Status messages
---

Messaging is a critical Status component. The Status app combines [peer-to-peer messaging][peer-to-peer-messaging] technologies with robust end-to-end encryption across all your devices. Peer-to-peer messaging eliminates the need for centralized servers and intermediaries, providing a censorship-resistant alternative to other popular messaging apps.

We've built the Status app to keep your messages and information out of our reach. Other messaging apps offer end-to-end encryption, but their centralized network design allows interpretation of who is talking to whom and where. See how Status compares to other messaging apps in the table below:

| Privacy feature               | Status               | Other messaging apps |
| :---------------------------- | :------------------- | :------------------- |
| End-to-end encryption         | :material-check-all: | :material-check-all: |
| Network metadata encryption   | :material-check-all: | :octicons-x-24:      |
| "Who talks to who" encryption | :material-check-all: | :material-check:     |
| Censorship resistant          | :material-check-all: | :octicons-x-24:      |
| Anonymous                     | :material-check-all: | :material-check:     |
| Open source                   | :material-check-all: | :material-check:     |

(:material-check-all: available, :material-check: available on some apps, :octicons-x-24: not available )

## The basics

- Your communications are end-to-end encrypted by default.
- Your messages are not stored on centralized servers.
- Only you and the message recipient can read your messages.
- Status cannot identify you or other participants in the conversation.

:::tip
For answers to general questions about your Status messages, check the [Messages FAQ][messages-faq] topic.
:::

## Understand peer-to-peer messaging

Status provides resilient messaging without relying on centralized servers, data centers, or service providers. The Status app uses [Waku :octicons-tab-external-16:][waku], a peer-to-peer protocol for private, secure, and censorship-resistant communication.

Unlike centralized networks (A), which depend on a central server to relay messages, peer-to-peer networks (B) encrypt and broadcast every message to all participant nodes. A node is a computer or smartphone that relays messages to other nodes or temporarily stores them for disconnected peers. Even when all nodes can access your messages, the content is encrypted so that only you and the intended recipients can read them.

![The peer-to-peer network sends messages to every node and doesn't rely on a central server.](/assets/docs/messaging-and-web3-browser/about-status-messages/125-0-1-dark.png)

## Built-in privacy and security

The Status app secures your messages the entire time they are in transit using end-to-end encryption. This industry standard protection uses strong encryption keys and ensures that only you and the recipients can read your messages. No one else (not even Status) can read your conversations or identify you or other participants.

When you communicate with someone on the Status app, your messages, attachments, sender metadata, group chats, and group metadata are all end-to-end encrypted.

Status incorporates the [Perfect Forward Secrecy :octicons-tab-external-16:][perfect-forward-secrecy] (PFS) encryption mechanism, ensuring that encryption keys change on every message. If your keys are compromised, only the associated message is compromised. All previous messages remain private.

:::info
Status messaging protects your privacy in one-to-one communications, chat groups, public chats, and Communities.
:::
