# Local anvil NFT test setup

Run these commands in a fresh anvil session:

```bash
anvil
cd apps/wallet/test-contracts
./setup-anvil.sh
```

Import this mnemonic into the wallet extension:

```text
test test test test test test test test test test test junk
```

Use the second default anvil account as the recipient:

```text
0x70997970c51812dc3a010c7d01b50e0d17dc79c8
```
