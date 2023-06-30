---
id: 376
revision: '0'
language: en
title: If you lose your Status password or recovery phrase
---

When you lose access to your Status password or recovery phrase, you may lose access to your Status data and wallet funds. Status can't recover your data or wallet funds for you due to its [decentralized architecture](../getting-started/what-is-status.md). It's your responsibility to keep your password and recovery phrase safe.

:::info
If you have your recovery phrase, your wallet funds are safe. In this case, [restore your Status profile](../getting-started/create-or-restore-your-status-profile-using-a-recovery-phrase.md) using your recovery phrase.
:::

Depending on your circumstances, you may be able to recover your Status data and wallet funds. Select the option that describes your situation:

- [If you have your recovery phrase but lose your Status password](#if-you-have-your-recovery-phrase-but-lose-your-status-password)
- [If you lose your recovery phrase but know your Status password](#if-you-lose-your-recovery-phrase-but-know-your-status-password)
- [If you lose your recovery phrase and Status password](#if-you-lose-your-recovery-phrase-and-status-password)

## If you have your recovery phrase but lose your Status password

Use your recovery phrase to access your wallet funds if you can't sign in due to a lost password, [Keycard](../about-keycard.md) or biometrics setup. Visit [Create or restore your Status profile using a recovery phrase](../getting-started/create-or-restore-your-status-profile-using-a-recovery-phrase.md) for instructions.

:::warn
Status doesn't know your password and can't reset it for you. If you forget your password, you may lose access to your Status profile.
:::

## If you lose your recovery phrase but know your Status password

If you lose your recovery phrase but can still sign in to your Status profile (using your password, [Keycard](../about-keycard.md) or biometrics), you can save the wallet funds by sending them to a different wallet address.

Follow these steps:

1. Sign in to the Status profile where you lost your recovery phrase.
1. Verify if your recovery phrase is still [available in the Status app](./back-up-and-secure-your-recovery-phrase#back-up-recovery-phrase.md). If it's available, [back up your recovery phrase](./back-up-and-secure-your-recovery-phrase#back-up-recovery-phrase.md). Your wallet funds are safe and you don't need to do anything else. If your recovery phrase isn't available, continue with the next step.
1. [Log out of Status](./log-out-of-status.md) and [create a new Status profile](../getting-started/run-the-status-app-for-the-first-time.md). This creates a new key pair and default wallet address.
1. Sign in to your new Status profile and copy the new wallet address.
1. [Log out](./log-out-of-status.md) of your new profile and sign in to the profile where you lost your recovery phrase.
1. From the Status profile where you lost your recovery phrase, [send all your wallet funds](../status-wallet/send-crypto.md) to the new wallet address.

:::warn
Status can't see your recovery phrase or recover it for you. [Keep your recovery phrase safe](./back-up-and-secure-your-recovery-phrase.md), and never share this information with anyone.
:::

## If you lose your recovery phrase and Status password

If lose your recovery phrase and can't sign in to your Status profile due to a lost password, [Keycard](../about-keycard.md) or biometrics setup, you lose access to your Status data and wallet funds forever.

:::warn
Status can't see or access your password or recovery phrase. If you lose them or forget them, Status can't recover or replace them.
:::

In this situation, if you're still signed in to your Status profile, you may be able to save the wallet funds by sending them to a different wallet address.

Follow these steps:

1. Don't log out of Status and don't change to another app. Plug in your device to charge it. Don't restart your device or update the Status app.
1. Verify if your recovery phrase is still [available in the Status app](./back-up-and-secure-your-recovery-phrase#back-up-recovery-phrase.md). If it's available, [back up your recovery phrase](./back-up-and-secure-your-recovery-phrase#back-up-recovery-phrase.md). Your wallet funds are safe but you need [create a new Status profile with the recovery phrase](../getting-started/create-or-restore-your-status-profile-using-a-recovery-phrase.md) because your password is lost. If your recovery phrase is not available, continue with the next step.
1. Using a second device, [create a new Status profile](../getting-started/run-the-status-app-for-the-first-time.md). This creates a new key pair and default wallet address.
1. On the second device, copy the new wallet address.
1. From the Status profile where you lost your recovery phrase and password, [send all your wallet funds](../status-wallet/send-crypto.md) to the new wallet address.
