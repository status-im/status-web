# Hardware wallet QR signing

How `hardware-qr` wallets sign through the ERC-4527 two-QR round trip, covering [`HardwareSignScreen`](../packages/wallet/src/components/hardware-sign-screen/index.tsx) in `packages/wallet` and the signing paths in [`apps/wallet`](../apps/wallet/src).

## Hardware wallets

A wallet imported over QR is stored with `type: 'hardware-qr'` and a `hardware` field holding `vendor`, `publicKey` and `sourceFingerprint` ([`wallet-metadata.ts`](../apps/wallet/src/data/wallet-metadata.ts)). The extension holds no key for it. `sourceFingerprint` identifies the device's seed and goes into every sign request; it is `undefined` for devices that do not expose it. Every request also names the signing account's stored `derivationPath`, so the device signs with that account's key.

Signing needs no unlocked session for these wallets, so the send dialogs, the exchange drawer and the dApp connect and signing popups skip the password prompt. The popup learns the wallet type from `walletType` in the approval record.

The key-based procedures in [`api.ts`](../apps/wallet/src/data/api.ts) (`send`, `sendErc20`, `sendContractCall`, `signMessage`, `signTypedData`) are never called for a hardware wallet. `getSigningKey` has no hardware case, so one that reached it would fail with `Wallet is not private key type`.

## The QR round trip

`HardwareSignScreen` runs one exchange. It shows the request as an animated QR built by `buildEthSignRequestURParts` from `@qrkit/core`, one frame every 200 ms. After Continue it turns the camera on and reads the device's answer with `parseEthSignature`. It passes the hex signature to `checkSignature` and then to `onSignature`, or calls `onCancel`. Callers check with `checkHardwareSignature` ([`hardware-signature.ts`](../apps/wallet/src/lib/hardware-signature.ts)), which recovers the signer from the signed hash and refuses any other address, including the device's answer to an older request. An answer that does not parse or fails the check is shown on screen and scanning continues.

Callers reject with `HardwareSignCancelledError` when the user cancels, and the send dialogs treat it as the user's decision rather than a failure, so no error toast appears.

| `kind`            | ERC-4527 data type     | Sign data                                                                                                                                                                                  |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `personalMessage` | `PersonalMessage` (3)  | The message bytes. A dApp message is decoded if hex and UTF-8 encoded otherwise ([`personal-message.ts`](../apps/wallet/src/lib/personal-message.ts)). The device adds the EIP-191 prefix. |
| `typedData`       | `TypedData` (2)        | The EIP-712 payload as a JSON string.                                                                                                                                                      |
| `transaction`     | `TypedTransaction` (4) | The serialized unsigned EIP-1559 transaction, with its `chainId`.                                                                                                                          |

The request's `origin` is the dApp origin for dApp requests and `Status Wallet` for the extension's own.

`@qrkit/react` also ships a `SignModal`. The screen uses only its `QRDisplay` and `useQRScanner`, so that the UI comes from `@status-im/components` and parse errors and cancellation reach the caller.

## Signing in the extension

[`SignerProvider`](../apps/wallet/src/providers/signer-context.tsx) checks the current wallet's type in `signMessage`, `signTypedData` and `signAndSendTransaction`. For a hardware wallet it opens `HardwareSignScreen` in a Radix dialog and waits for the result. Being a Radix dialog, it stacks above a modal that is already open, such as a send dialog or the exchange drawer, without closing it. One overlay is open at a time: a second request fails with `Another hardware wallet signature is in progress` instead of replacing the first.

The token and collectible pages send through `signAndSendTransaction` for every wallet type. Their send dialogs stay open under the QR screen, so a cancel on the device returns to the filled-in form.

### Transactions

The service worker builds and broadcasts the transaction, and only the signature crosses the QR exchange ([`hardware-tx.ts`](../apps/wallet/src/data/ethereum/hardware-tx.ts)):

1. `wallet.account.ethereum.buildUnsignedTransaction` reserves a nonce and returns the serialized unsigned transaction with a `nonceReservationId`.
2. The overlay gets the signature from the device.
3. `wallet.account.ethereum.broadcastSignedTransaction` attaches `r`, `s` and the parity to the unsigned transaction and broadcasts it. It requires a 65-byte signature whose `v` is the bare parity (0 or 1) or carries the legacy offset (27 or 28), and refuses one that does not recover to the sending address.

Fees come from the same `resolveFeeParams` as software sends. Transactions are built for Ethereum mainnet only: chain ID 1, network `ethereum`.

### Nonces

The exchange can take minutes and spans two calls to the service worker, so the nonce is held across it with `nonceTracker.reserveHeld` in [`nonce-tracker.ts`](../apps/wallet/src/lib/nonce-tracker.ts). A held reservation keeps the address's lock, so a second hardware send from the same address waits until the first one finishes.

- A successful broadcast commits the nonce (`commitHeld`).
- A failed broadcast releases it in the worker. A cancel or a failed exchange releases it from the UI through `wallet.account.ethereum.releaseNonceReservation` (`releaseHeld`).
- A reservation nobody commits or releases lapses after `HELD_NONCE_TTL_MS`, 10 minutes.

The lock lives in the service worker's memory. If the worker restarts during an exchange the lock is lost, but the commit still advances the stored counter, so a later send does not reuse the nonce. `withNonce`, which software sends use, is built on the same reserve, commit and release steps.

## dApp requests

The service worker has no camera, so dApp signing for a hardware wallet happens in the approval popup ([`approval-page.tsx`](../apps/wallet/src/entrypoints/approval/approval-page.tsx)). The wallet type comes from the wallet holding the origin's connected account, which is not necessarily the selected wallet.

Every approval record carries `walletType`, and the signing ones carry `sourceFingerprint`. For a hardware wallet the popup opens `HardwareSignScreen` after the user confirms and writes the device's signature to `ApprovalResult.signature`.

- `personal_sign` and `eth_signTypedData_v4`: the handlers in [`rpc/sign.ts`](../apps/wallet/src/lib/rpc/sign.ts) return that signature instead of signing in the worker. They take a signature from the popup only for hardware wallets.
- `eth_sendTransaction`: the handler in [`rpc/send-transaction.ts`](../apps/wallet/src/lib/rpc/send-transaction.ts) prices the transaction as for any wallet, then builds it with `buildUnsignedTransaction` before the popup opens and puts `serializedUnsignedTx` in the approval record. It broadcasts the signed transaction with `broadcastSignedTransaction` and returns the hash. The nonce is held from the build on; a reject, cancel, closed popup or timeout releases it in the handler.
