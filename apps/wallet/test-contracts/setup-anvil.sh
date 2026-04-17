#!/usr/bin/env bash
set -euo pipefail

ANVIL_RPC_URL="${ANVIL_RPC_URL:-http://127.0.0.1:8545}"
ANVIL_PRIVATE_KEY="${ANVIL_PRIVATE_KEY:-0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80}"
ANVIL_SENDER="${ANVIL_SENDER:-0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266}"
ERC721_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
ERC1155_ADDRESS="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

echo "Resetting local anvil chain..."
cast rpc --rpc-url "$ANVIL_RPC_URL" anvil_reset >/dev/null

echo "Deploying TestERC721 to deterministic address..."
forge create src/TestERC721.sol:TestERC721 \
  --rpc-url "$ANVIL_RPC_URL" \
  --private-key "$ANVIL_PRIVATE_KEY" \
  --broadcast \
  --constructor-args "$ANVIL_SENDER" >/dev/null

echo "Deploying TestERC1155 to deterministic address..."
forge create src/TestERC1155.sol:TestERC1155 \
  --rpc-url "$ANVIL_RPC_URL" \
  --private-key "$ANVIL_PRIVATE_KEY" \
  --broadcast \
  --constructor-args "$ANVIL_SENDER" >/dev/null

echo "ERC721:  $ERC721_ADDRESS (tokenId 0 minted to $ANVIL_SENDER)"
echo "ERC1155: $ERC1155_ADDRESS (tokenId 1, amount 3 minted to $ANVIL_SENDER)"
echo "Wallet A mnemonic: test test test test test test test test test test test junk"
echo "Wallet B address: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
