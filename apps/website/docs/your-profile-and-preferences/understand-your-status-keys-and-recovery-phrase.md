---
id: 112
revision: '0'
language: en
title: Understand your Status keys and recovery phrase
---

Your Status keys are essential in securing and authenticating your communication and transactions. Unlike centralized services that store usernames and passwords on servers, Status uses cryptographic keys for authentication and authorization.

Using cryptographic keys, Status gives you complete control over your data. You don't need any personally identifiable information (like your email or phone number) to [create a Status profile](../getting-started/run-the-status-app-for-the-first-time.md), and your information is never shared or stored with third parties.

:::tip
For common questions about your Status keys and recovery phrase, check out [FAQ: Status keys and recovery phrase](./faq-status-keys-and-recovery-phrase.md).
:::

## About your Status keys

When you [create a new Status profile](../getting-started/run-the-status-app-for-the-first-time.md), the Status app generates a public and a private cryptographic key (a key pair). In essence, these keys are large strings of characters securely stored on your device and protected by your Status password.

:::warn
Status doesn't know your password and can't reset it for you. If [you forget your password](../if-you-lose-your-password-or-recovery-phrase.md), you may lose access to your Status profile and wallet funds. Remember your Status password, keep it in a safe place, and don't share it with anyone.
:::

The Status app uses your private key to sign and encrypt your messages, making sure that only the intended recipient can read them and that no one can tamper with them. You should never share your private key.

:::info
You can regenerate your private key on a different device using your [recovery phrase](#about-your-recovery-phrase).
:::

Your public key is paired with your private key and identifies your Status profile and [Status wallet](../status-wallet/status-wallet-your-quick-start-guide.md) address. For this reason, you can freely share your public key without worry. While anyone can send you a message or a crypto transaction to your public key, you need your private key to confirm you're the intended recipient.

Public and private keys function similarly to doors and keys in the physical world. Door keys are private and personal, but the door is public and visible to everyone.

## About your recovery phrase

A recovery phrase (also known as a seed phrase or backup phrase) is a set of words that can be used to regenerate your private key. If you lose or damage your device, you can restore access to your Status data and wallet funds using your recovery phrase on a new device.

Because your recovery phrase can be used to regenerate your private key, you must keep your recovery phrase words always secure.

:::warn
[If you lose your recovery phrase](../if-you-lose-your-password-or-recovery-phrase.md), you lose access to your data and wallet funds. Keep your recovery phrase safe, and never share this information with anyone. Status will never ask you for this information.
:::

## Status chat key and wallet address

The Status apps generates the first key pair (public and private keys) when you [create a new Status profile](../getting-started/run-the-status-app-for-the-first-time.md). From this master key pair, the app makes additional key pairs, such as the chat key and wallet address, which look similar but have different purposes.

Your chat key is a long hexadecimal string (a hash code) part of your public Status profile. You share your chat key when you [add a contact](./add-a-contact-in-status.md) to start a conversation. You can also connect your chat key with an [ENS username](https://ens.domains/), like `alice.eth` or `alice.stateofus.eth`.

Your [wallet address](../status-wallet/about-your-wallet-accounts-and-addresses.md) is a shortened form of your public key. This address is public and can be used to receive crypto. Some content creators and organisations show this address publicly on their websites to receive funds.
