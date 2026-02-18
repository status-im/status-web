#!/usr/bin/env bash
# =============================================================================
# Setup Anvil local forks for E2E deposit tests
#
# Creates a "base snapshot": ETH funded + vaults enabled, NO tokens.
# Per-test token funding is handled by AnvilRpcHelper in the test framework.
#
# Usage:
#   ./scripts/setup-anvil.sh              # Start forks + base setup
#   ./scripts/setup-anvil.sh --stop       # Stop running Anvil processes
#   ./scripts/setup-anvil.sh --status     # Check fork status
#
# Prerequisites:
#   - Foundry (anvil, cast): https://getfoundry.sh
#   - WALLET_SEED_PHRASE in e2e/.env
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"

# Load .env
if [ -f "$E2E_DIR/.env.local" ]; then
  set -a; source "$E2E_DIR/.env.local"; set +a
fi
if [ -f "$E2E_DIR/.env" ]; then
  set -a; source "$E2E_DIR/.env"; set +a
fi

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------

MAINNET_FORK_PORT=8547
LINEA_FORK_PORT=8546
MAINNET_RPC="http://localhost:$MAINNET_FORK_PORT"
LINEA_RPC="http://localhost:$LINEA_FORK_PORT"

# Public RPC endpoints for forking (override via env for reliability)
MAINNET_FORK_URL="${MAINNET_FORK_URL:-https://eth.llamarpc.com}"
LINEA_FORK_URL="${LINEA_FORK_URL:-https://rpc.linea.build}"

# Derive test wallet address from seed phrase
if [ -z "${WALLET_SEED_PHRASE:-}" ]; then
  echo "ERROR: WALLET_SEED_PHRASE not set. Check e2e/.env"
  exit 1
fi

WALLET_ADDRESS=$(cast wallet address --mnemonic "$WALLET_SEED_PHRASE" --mnemonic-index 0 2>/dev/null)
echo "Test wallet address: $WALLET_ADDRESS"

# Vault addresses
WETH_VAULT="0xc71Ec84Ee70a54000dB3370807bfAF4309a67a1f"
SNT_VAULT="0x493957E168aCCdDdf849913C3d60988c652935Cd"
GUSD_VAULT="0x79B4cDb14A31E8B0e21C0120C409Ac14Af35f919"
LINEA_VAULT="0xb223cA53A53A5931426b601Fa01ED2425D8540fB"

# Vault state storage slot (slot 8 = vault enabled state)
VAULT_STATE_SLOT="0x0000000000000000000000000000000000000000000000000000000000000008"
VAULT_ENABLED_VALUE="0x0000000000000000000000000000000000000000000000000000000000000001"

# PID files
MAINNET_PID_FILE="$E2E_DIR/.anvil-mainnet.pid"
LINEA_PID_FILE="$E2E_DIR/.anvil-linea.pid"

# -----------------------------------------------------------------------------
# Functions
# -----------------------------------------------------------------------------

check_prerequisites() {
  if ! command -v anvil &>/dev/null; then
    echo "ERROR: anvil not found. Install Foundry: https://getfoundry.sh"
    exit 1
  fi
  if ! command -v cast &>/dev/null; then
    echo "ERROR: cast not found. Install Foundry: https://getfoundry.sh"
    exit 1
  fi
}

wait_for_rpc() {
  local url=$1
  local name=$2
  local max_attempts=30

  echo -n "  Waiting for $name..."
  for i in $(seq 1 $max_attempts); do
    if cast block-number --rpc-url "$url" &>/dev/null; then
      echo " ready (block $(cast block-number --rpc-url "$url"))"
      return 0
    fi
    sleep 1
    echo -n "."
  done

  echo " FAILED (timeout after ${max_attempts}s)"
  return 1
}

start_forks() {
  echo "=== Starting Anvil forks ==="

  # Stop existing processes if running
  stop_forks 2>/dev/null || true

  # Start mainnet fork
  echo "[1/2] Starting mainnet fork on port $MAINNET_FORK_PORT..."
  anvil \
    --port "$MAINNET_FORK_PORT" \
    --fork-url "$MAINNET_FORK_URL" \
    --chain-id 1 \
    --silent &
  echo $! > "$MAINNET_PID_FILE"
  wait_for_rpc "$MAINNET_RPC" "mainnet fork"

  # Start Linea fork
  echo "[2/2] Starting Linea fork on port $LINEA_FORK_PORT..."
  anvil \
    --port "$LINEA_FORK_PORT" \
    --fork-url "$LINEA_FORK_URL" \
    --chain-id 59144 \
    --silent &
  echo $! > "$LINEA_PID_FILE"
  wait_for_rpc "$LINEA_RPC" "Linea fork"

  echo ""
}

stop_forks() {
  echo "=== Stopping Anvil forks ==="

  for pidfile in "$MAINNET_PID_FILE" "$LINEA_PID_FILE"; do
    if [ -f "$pidfile" ]; then
      local pid=$(cat "$pidfile")
      if kill -0 "$pid" 2>/dev/null; then
        kill "$pid"
        echo "  Stopped PID $pid"
      fi
      rm -f "$pidfile"
    fi
  done

  echo "Done."
}

fund_eth() {
  local rpc=$1
  local name=$2
  local amount_hex="0x8AC7230489E80000" # 10 ETH in wei (hex)

  echo "  Funding $WALLET_ADDRESS with 10 ETH on $name..."
  cast rpc anvil_setBalance "$WALLET_ADDRESS" "$amount_hex" --rpc-url "$rpc" >/dev/null
}

enable_vault() {
  local vault=$1
  local vault_name=$2
  local rpc=$3

  echo "  Enabling $vault_name..."
  cast rpc anvil_setStorageAt "$vault" "$VAULT_STATE_SLOT" "$VAULT_ENABLED_VALUE" --rpc-url "$rpc" >/dev/null
}

base_setup() {
  echo "=== Base setup (ETH + vaults) ==="
  echo ""
  echo "  NOTE: ERC-20 token funding is handled per-test by AnvilRpcHelper."
  echo "  This script only sets up the base state: ETH for gas + vault state."
  echo ""

  echo "[Mainnet fork]"
  fund_eth "$MAINNET_RPC" "mainnet"

  echo ""
  echo "[Linea fork]"
  fund_eth "$LINEA_RPC" "Linea"

  echo ""
  echo "=== Enabling vaults ==="
  enable_vault "$WETH_VAULT" "WETH vault" "$MAINNET_RPC"
  enable_vault "$SNT_VAULT" "SNT vault" "$MAINNET_RPC"
  enable_vault "$GUSD_VAULT" "GUSD vault" "$MAINNET_RPC"
  enable_vault "$LINEA_VAULT" "LINEA vault" "$LINEA_RPC"

  echo ""
}

check_status() {
  echo "=== Anvil fork status ==="

  for name_rpc in "Mainnet:$MAINNET_RPC" "Linea:$LINEA_RPC"; do
    local name="${name_rpc%%:*}"
    local rpc="${name_rpc#*:}"
    if cast block-number --rpc-url "$rpc" &>/dev/null; then
      echo "  $name ($rpc): UP (block $(cast block-number --rpc-url "$rpc"))"
      echo "    ETH balance: $(cast balance "$WALLET_ADDRESS" --rpc-url "$rpc" --ether) ETH"
    else
      echo "  $name ($rpc): DOWN"
    fi
  done

  echo ""
  echo "[Vault states]"
  echo "  WETH vault:  $(cast storage "$WETH_VAULT" "$VAULT_STATE_SLOT" --rpc-url "$MAINNET_RPC" 2>/dev/null || echo 'N/A')"
  echo "  SNT vault:   $(cast storage "$SNT_VAULT" "$VAULT_STATE_SLOT" --rpc-url "$MAINNET_RPC" 2>/dev/null || echo 'N/A')"
  echo "  GUSD vault:  $(cast storage "$GUSD_VAULT" "$VAULT_STATE_SLOT" --rpc-url "$MAINNET_RPC" 2>/dev/null || echo 'N/A')"
  echo "  LINEA vault: $(cast storage "$LINEA_VAULT" "$VAULT_STATE_SLOT" --rpc-url "$LINEA_RPC" 2>/dev/null || echo 'N/A')"
}

print_next_steps() {
  echo ""
  echo "=== Setup complete ==="
  echo ""
  echo "Next steps:"
  echo "  1. Start Hub with Anvil RPCs:"
  echo "     NEXT_PUBLIC_MAINNET_RPC_URL=$MAINNET_RPC NEXT_PUBLIC_LINEA_RPC_URL=$LINEA_RPC pnpm --filter=./apps/hub dev"
  echo ""
  echo "  2. Enable Anvil in e2e/.env:"
  echo "     ANVIL_MAINNET_RPC=$MAINNET_RPC"
  echo "     ANVIL_LINEA_RPC=$LINEA_RPC"
  echo "     BASE_URL=http://localhost:3003"
  echo ""
  echo "  3. Run deposit tests:"
  echo "     cd e2e && pnpm test:anvil"
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

check_prerequisites

case "${1:-}" in
  --stop)
    stop_forks
    exit 0
    ;;
  --status)
    check_status
    exit 0
    ;;
  *)
    start_forks
    base_setup
    check_status
    print_next_steps
    ;;
esac
