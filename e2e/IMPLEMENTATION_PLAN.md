# E2E Infrastructure Improvements — Implementation Plan

Based on analysis of status-go functional tests infrastructure.

---

## Phase 1: Quick Wins

### 1. Dockerize Anvil (`docker-compose.anvil.yml`)

**Goal:** Replace native Anvil CLI with Docker containers for reproducibility and CI portability.

**File to create:** `e2e/docker-compose.anvil.yml`

```yaml
services:
  anvil-mainnet:
    image: ghcr.io/foundry-rs/foundry:v1.4.0
    platform: ${DOCKER_PLATFORM:-linux/amd64}
    entrypoint: anvil
    command:
      - --host=0.0.0.0
      - --port=8545
      - --fork-url=${MAINNET_FORK_URL:-https://ethereum-rpc.publicnode.com}
      - --chain-id=1
      - --silent
    ports:
      - '${MAINNET_FORK_PORT:-8547}:8545'
    healthcheck:
      test:
        ['CMD', 'cast', 'block-number', '--rpc-url', 'http://localhost:8545']
      interval: 2s
      timeout: 5s
      retries: 15

  anvil-linea:
    image: ghcr.io/foundry-rs/foundry:v1.4.0
    platform: ${DOCKER_PLATFORM:-linux/amd64}
    entrypoint: anvil
    command:
      - --host=0.0.0.0
      - --port=8545
      - --fork-url=${LINEA_FORK_URL:-https://rpc.linea.build}
      - --chain-id=59144
      - --silent
    ports:
      - '${LINEA_FORK_PORT:-8546}:8545'
    healthcheck:
      test:
        ['CMD', 'cast', 'block-number', '--rpc-url', 'http://localhost:8545']
      interval: 2s
      timeout: 5s
      retries: 15
```

**Notes:**

- `ghcr.io/foundry-rs/foundry:v1.4.0` pins a specific Foundry version for reproducibility.
- `platform` defaults to `linux/amd64` but is configurable via `DOCKER_PLATFORM` env var. On ARM machines with a native multi-arch image, set `DOCKER_PLATFORM=linux/arm64` to avoid Rosetta emulation overhead.
- `entrypoint: anvil` is needed because the foundry image default entrypoint is `sh`.
- Healthchecks use `cast` which is also available in the foundry image.
- External ports match existing convention (8547 = mainnet, 8546 = linea).
- Fork URLs are configurable via env vars with the same defaults as `setup-anvil.sh`.

---

### 2. Update `setup-anvil.sh` — Docker mode support

**File to modify:** `e2e/scripts/setup-anvil.sh`

**Design decision:** Docker mode replaces only Anvil process management. Local `cast` is still required for `base_setup` (ETH funding, vault enabling) in both native and Docker modes. This keeps the script simple — no `docker exec` wrappers needed. `check_prerequisites` runs in both modes.

**Changes:**

- Add `--docker` flag to start Anvil via docker compose instead of native CLI.
- Add `--stop-docker` to stop Docker containers.
- Keep native mode as default (backward compatible) — Docker mode is opt-in.
- Docker mode uses `docker compose -f docker-compose.anvil.yml up -d --wait` (waits for healthchecks).
- Docker stop uses `docker compose -f docker-compose.anvil.yml down`.
- `check_prerequisites` (requires local `cast`) runs in both modes — needed for `base_setup`.

```bash
# New flags:
#   ./scripts/setup-anvil.sh --docker         # Start via Docker + base setup
#   ./scripts/setup-anvil.sh --stop-docker    # Stop Docker containers

start_forks_docker() {
  echo "=== Starting Anvil forks (Docker) ==="
  stop_forks_docker 2>/dev/null || true
  docker compose -f "$E2E_DIR/docker-compose.anvil.yml" up -d --wait
  echo "  Mainnet fork: http://localhost:$MAINNET_FORK_PORT"
  echo "  Linea fork:   http://localhost:$LINEA_FORK_PORT"
}

stop_forks_docker() {
  echo "=== Stopping Anvil forks (Docker) ==="
  docker compose -f "$E2E_DIR/docker-compose.anvil.yml" down
  echo "Done."
}
```

**Updated main case block:**

```bash
case "${1:-}" in
  --stop)
    stop_forks
    exit 0
    ;;
  --docker)
    check_prerequisites  # cast required for base_setup
    case "${2:-}" in
      --stop) stop_forks_docker ;;
      *)
        start_forks_docker
        base_setup
        check_status
        print_next_steps
        ;;
    esac
    exit 0
    ;;
  --stop-docker)
    stop_forks_docker
    exit 0
    ;;
  --status)
    check_status
    exit 0
    ;;
  *)
    check_prerequisites
    start_forks
    base_setup
    check_status
    print_next_steps
    ;;
esac
```

---

### 3. Add `package.json` scripts for Docker mode

**File to modify:** `e2e/package.json`

Add new scripts:

```json
{
  "scripts": {
    "anvil:up": "docker compose -f docker-compose.anvil.yml up -d --wait",
    "anvil:down": "docker compose -f docker-compose.anvil.yml down",
    "anvil:setup": "./scripts/setup-anvil.sh --docker",
    "test:anvil:docker": "./scripts/setup-anvil.sh --docker && playwright test --project=anvil-deposits; EXIT=$?; ./scripts/setup-anvil.sh --stop-docker; exit $EXIT"
  }
}
```

**Notes:**

- `test:anvil:docker` teardown uses `./scripts/setup-anvil.sh --stop-docker` (not a raw `docker compose down`) to keep teardown logic in a single place and avoid drift.
- Existing `test:anvil` script stays unchanged (native mode).

---

### 4. Add retry logic to `AnvilRpcHelper`

**File to modify:** `e2e/src/helpers/anvil-rpc.ts`

**Design decision:** Retry only transient (infrastructure) errors. JSON-RPC semantic errors (`json.error`) are never retried — they indicate deterministic failures (invalid params, execution reverted, etc.) that would fail identically on every attempt.

**Classification of retryable errors:**

- **Retryable (transient):** `fetch()` network errors (TypeError: Failed to fetch), HTTP 5xx, HTTP 429 (rate limit), request timeouts.
- **Not retryable (deterministic):** JSON-RPC errors (`json.error` with code/message), HTTP 4xx (except 429), successful responses with `execution reverted`.

**Changes:**

Refactor `call()` to throw typed errors, add `callWithRetry`:

```typescript
/** Error class for transient RPC failures (network, 5xx, 429) — safe to retry */
class TransientRpcError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TransientRpcError'
  }
}

/** Error class for deterministic RPC failures (invalid params, reverts) — do NOT retry */
class RpcError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RpcError'
  }
}
```

Update existing `call()` to distinguish error types:

```typescript
private async call(
  rpc: string,
  method: string,
  params: unknown[],
): Promise<any> {
  const id = ++this.rpcIdCounter

  let response: Response
  try {
    response = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
    })
  } catch (error) {
    // Network-level failure (DNS, connection refused, timeout) — transient
    throw new TransientRpcError(
      `Anvil RPC network error (${method}): ${error instanceof Error ? error.message : error}`,
    )
  }

  if (!response.ok) {
    const body = await response.text()
    // 5xx and 429 are transient; other HTTP errors are not
    if (response.status >= 500 || response.status === 429) {
      throw new TransientRpcError(
        `Anvil RPC HTTP ${response.status} (${method}): ${body}`,
      )
    }
    throw new RpcError(
      `Anvil RPC HTTP ${response.status} (${method}): ${body}`,
    )
  }

  const json = await response.json()

  if (json.error) {
    // JSON-RPC semantic error — deterministic, do not retry
    throw new RpcError(
      `Anvil RPC error (${method}): ${json.error.message ?? JSON.stringify(json.error)}`,
    )
  }

  return json.result
}
```

Add retry wrapper that only catches transient errors:

```typescript
/**
 * RPC call with retry for transient failures only.
 * Network errors, HTTP 5xx, and 429 are retried.
 * JSON-RPC semantic errors (invalid params, reverts) are thrown immediately.
 */
private async callWithRetry(
  rpc: string,
  method: string,
  params: unknown[],
  maxRetries = 5,
  delayMs = 200,
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await this.call(rpc, method, params)
    } catch (error) {
      // Only retry transient errors — deterministic errors fail immediately
      if (!(error instanceof TransientRpcError)) throw error
      if (attempt === maxRetries) throw error
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}
```

**Methods to update (use `callWithRetry` instead of `call`):**

| Method              | Why                                         | Retry config           |
| ------------------- | ------------------------------------------- | ---------------------- |
| `healthCheck()`     | First contact — Anvil may still be starting | 3 retries, 500ms delay |
| `getErc20Balance()` | Called after state changes, fork may lag    | 5 retries, 200ms delay |

**Methods NOT to update:**

- `snapshot()`, `revert()` — must fail immediately (test isolation)
- `setEthBalance()`, `setErc20BalanceViaStorage()` — state mutations should not be silently retried
- `eth_sendTransaction` calls — tx submission should not be blindly retried

**Concrete changes to `healthCheck`:**

```typescript
async healthCheck(rpc?: string): Promise<boolean> {
  try {
    await this.callWithRetry(rpc ?? this.mainnetRpc, 'eth_blockNumber', [], 3, 500)
    return true
  } catch {
    return false
  }
}
```

**Concrete changes to `getErc20Balance`:**

```typescript
async getErc20Balance(token: string, rpc?: string): Promise<bigint> {
  const data = SELECTORS.BALANCE_OF + encodeAddress(this.walletAddress)
  const result = await this.callWithRetry(rpc ?? this.mainnetRpc, 'eth_call', [
    { to: token, data },
    'latest',
  ])
  return BigInt(result)
}
```

---

### 5. Add `contractExists()` to `AnvilRpcHelper`

**File to modify:** `e2e/src/helpers/anvil-rpc.ts`

Add method in the "Health check" section:

```typescript
/** Check if a contract exists at the given address (has deployed bytecode) */
async contractExists(address: string, rpc?: string): Promise<boolean> {
  const code = await this.call(rpc ?? this.mainnetRpc, 'eth_getCode', [
    address,
    'latest',
  ])
  return code !== '0x' && code !== '0x0'
}
```

Enhance `requireHealthy()` to verify key vault contracts:

```typescript
async requireHealthy(): Promise<void> {
  const [mainnetOk, lineaOk] = await Promise.all([
    this.healthCheck(this.mainnetRpc),
    this.healthCheck(this.lineaRpc),
  ])

  if (!mainnetOk || !lineaOk) {
    const down = [
      !mainnetOk && `mainnet (${this.mainnetRpc})`,
      !lineaOk && `linea (${this.lineaRpc})`,
    ]
      .filter(Boolean)
      .join(', ')

    throw new Error(
      `Anvil fork(s) not reachable: ${down}. ` +
        'Start them with: cd e2e && ./scripts/setup-anvil.sh',
    )
  }

  // Verify key contracts exist on the fork (catches stale/incomplete forks)
  const KEY_CONTRACTS = [
    { address: CONTRACTS.SNT, name: 'SNT', rpc: this.mainnetRpc },
    { address: CONTRACTS.WETH, name: 'WETH', rpc: this.mainnetRpc },
    { address: CONTRACTS.LINEA, name: 'LINEA', rpc: this.lineaRpc },
  ]

  for (const { address, name, rpc } of KEY_CONTRACTS) {
    const exists = await this.contractExists(address, rpc)
    if (!exists) {
      throw new Error(
        `Contract ${name} (${address}) not found on fork. ` +
          'The fork state may be stale or incomplete.',
      )
    }
  }
}
```

---

## Summary of file changes

| File                           | Action     | Description                                                                                                                                    |
| ------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/docker-compose.anvil.yml` | **Create** | Docker Compose for Anvil mainnet + Linea forks                                                                                                 |
| `e2e/scripts/setup-anvil.sh`   | **Modify** | Add `--docker` / `--stop-docker` flags                                                                                                         |
| `e2e/src/helpers/anvil-rpc.ts` | **Modify** | Add `TransientRpcError`/`RpcError`, `callWithRetry()`, `contractExists()`, update `call()`, `healthCheck`, `getErc20Balance`, `requireHealthy` |
| `e2e/package.json`             | **Modify** | Add `anvil:up`, `anvil:down`, `anvil:setup`, `test:anvil:docker` scripts                                                                       |

---

## Verification checklist

1. **Docker Compose starts correctly:**

   ```bash
   cd e2e && docker compose -f docker-compose.anvil.yml up -d --wait
   cast block-number --rpc-url http://localhost:8547  # mainnet
   cast block-number --rpc-url http://localhost:8546  # linea
   docker compose -f docker-compose.anvil.yml down
   ```

2. **Docker mode via script:**

   ```bash
   cd e2e && ./scripts/setup-anvil.sh --docker
   ./scripts/setup-anvil.sh --status
   ./scripts/setup-anvil.sh --stop-docker
   ```

3. **Native mode unchanged:**

   ```bash
   cd e2e && ./scripts/setup-anvil.sh          # still works as before
   ./scripts/setup-anvil.sh --stop
   ```

4. **Anvil tests pass with both modes:**

   ```bash
   cd e2e && pnpm test:anvil          # native
   cd e2e && pnpm test:anvil:docker   # docker
   ```

5. **Retry logic — transient errors only:**
   - `healthCheck` retries 3 times with 500ms delay on `TransientRpcError`, returns false if exhausted
   - `getErc20Balance` retries 5 times with 200ms delay on `TransientRpcError`
   - JSON-RPC errors (e.g. `execution reverted`, `invalid params`) fail immediately without retry
   - `fundSnt` balance verification benefits from retried `getErc20Balance`

6. **Contract existence check:**
   - `requireHealthy()` verifies SNT, WETH, LINEA contracts exist on forks
   - Clear error message if fork is stale

7. **ARM compatibility:**
   - `DOCKER_PLATFORM=linux/arm64 docker compose -f docker-compose.anvil.yml up -d` — works if image supports arm64

---

## Phase 2 (future, not in this PR)

| Item                                          | When                                                     |
| --------------------------------------------- | -------------------------------------------------------- |
| Foundry container for custom contract deploys | When testing contracts not on mainnet                    |
| Secret redacting in Playwright reporter       | When CI log auditing becomes a concern                   |
| Dynamic port allocation for parallel workers  | When test count grows and sequential run is a bottleneck |
