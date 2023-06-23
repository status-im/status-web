---
id: 232
revision: '0'
language: en
title: Messages FAQ
---

Messaging others is an important part of your Status experience, along with [Status Communities][how-to-use-communities-your-quick-start-guide], the [Status Wallet][status-wallet-your-quick-start-guide] and the [Status Web3 browser][how-to-use-status-browser-your-quick-start-guide]. In Status, you can message others and chat in communities privately and securely.

The Status app provides a privacy-centric messenger using decentralized [peer-to-peer (P2P) technology][about-status-messages] and strong end-to-end (E2EE) encryption.

## General questions

### What makes Status messaging decentralized?

Instead of centralized networks, which rely on servers controlled by corporations or governments, Status uses a distributed network of nodes. This network is based on Waku, a [peer-to-peer protocol][about-status-messages] for private, secure and censorship-resistant communication.

In a distributed network, users can securely and directly exchange data without intermediaries that could potentially compromise their privacy.

### Peer-to-peer networks send messages to every node. Is this not a risk?

No, it's not. While it's true that messages are sent to every node in a peer-to-peer network, these messages are encrypted. Only the intended recipient can decrypt and read the message.

### How is Status messaging censorship-resistant?

The Status peer-to-peer network ensures the resilience of the messaging network. For instance, when a network node is shut down or blocked, you can still connect to other nodes.

Status supports free speech infrastructure that prevents us, or anyone else, from censoring you.

:::info
Nodes in the network still rely on having an internet connection. So if your internet provider (or an authoritarian regime) shuts down your network, Status messaging won't work.
:::

## Status messaging

### Are my messages in the blockchain?

No, your messages are not in the blockchain and are not transported through the [Ethereum network][about-the-ethereum-blockchain]. Messages are temporarily stored in the peer-to-peer network.

### Can I delete my messages?

Yes, you can always [edit and delete your messages][edit-and-delete-your-messages].

In some cases, users may still see your original messages, even after you edit or delete them. Check out [Edit and delete your messages][edit-and-delete-your-messages] for more information.

### If I'm disconnected, can I still access my messages?

The [peer-to-peer network][about-status-messages] store messages that couldn't be delivered for up to 30 days. Your device downloads and securely stores these messages permanently when you connect to the network. Messages stored on your device are always available offline.

## Privacy and security

### How does Status protect my privacy?

Status implements end-to-end encryption (E2EE) using [cryptographic keys][understand-your-status-keys-and-recovery-phrase]. When you send a message, the message is encrypted using the recipient's public key. The only way to decrypt the message and read its content is by using the recipient's private key. Even if a malicious actor intercepts the message, they can't read its content as they don't have the private key.

:::info
The [Waku network][waku] implements additional privacy capabilities in addition to E2EE, such as sender anonymity or metadata protection.
:::

### Other messaging apps use E2EE encryption; why use Status?

While other messaging apps offer E2EE encryption, their centralized network design allows interpretation of who is talking to whom and where. These messaging apps can collect and sell your data and create a profile about you.

We've built Status so your information is secure and out of our reach. However, it's important to remember that no privacy tool can guarantee absolute data security.

### Can Status read my messages?

No. No one besides you and the intended recipient can read your messages. For more information on how Status messaging protects your privacy, check out [About your Status keys][about-status-keys].

### Who owns the peer-to-peer network nodes?

Anybody running the Status app becomes a node in the peer-to-peer network. This contributes to a more decentralized and resilient network.

:::info
Currently, Status runs nodes to ensure messages can be delivered reliably to disconnected peers.While all traffic is encrypted and out of Status reach, we hope to reduce Status participation progressively.
:::

### Is Status really decentralized if Status runs some of the network nodes?

The fact that Status users are part of the network is a crucial feature of the decentralized design. As long as the network remains open and accessible to all users and is not controlled by a single entity, Status' operation of some network nodes does not undermine this design.
