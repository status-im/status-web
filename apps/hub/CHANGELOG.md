# hub

## 1.0.1

### Patch Changes

- 9c3823b: upgrade next
- Updated dependencies [f50d31d]
- Updated dependencies [d92da0c]
- Updated dependencies [8500222]
- Updated dependencies [9c3823b]
  - @status-im/wallet@0.1.1
  - @status-im/status-network@0.1.1

## 1.0.0

### Major Changes

- 66d30c0: ### Staking & Vault Management System
  - **New Hooks:**
    - Staking functionality with multiplier points tracking
    - Vault locking mechanisms
    - Token approval and withdrawal flows
    - Account vaults management
    - Faucet integration for testing
    - Emergency mode functionality

  - **User Experience:**
    - Lock status indicators in vault selection UI
    - Improved table overflow handling
    - Enhanced slider configuration for vault lockup periods

  ### UI Components
  - **New Modals:**
    - Withdraw modal for vault withdrawals
    - Lock configuration modal for vault locking
    - Compound modal for compounding rewards
    - Promo modal for staking page
    - Action status component (formerly progress dialog)

  - **UI Improvements:**
    - New icons added
    - Enhanced vault table components
    - Better modal state management

  ### Authentication & Web3 Integration
  - **SIWE Integration:**
    - Sign-In With Ethereum (SIWE) for wallet authentication
    - ConnectKit integration for wallet connection
    - Wagmi configuration and providers setup

  ### State Management & Data Fetching
  - **Dependencies Added:**
    - `@tanstack/react-query` for server state management
    - `react-table` for table data management
    - Improved overall state management patterns

  ### Emergency Features
  - Emergency mode functionality for vault operations
  - Enhanced safety controls for vault lockup periods

  ## Refactoring & Maintenance

  ### Code Quality Improvements
  - Simplified vault table action handlers
  - Removed unnecessary onClick logic for modal state management
  - Renamed progress dialog to action status component for clarity

### Minor Changes

- e55e998: generate `apps/hub`
- b94eaff: chore: update waku dependencies => update to node 22

### Patch Changes

- 732f967: add unstaking support
- dc07597: add wallet connect
- 0fa9d76: discover section
- 512c80c: external links
- 8a3f4be: set a max layout width for hub layout
- 4f20911: add amount validation util
- 563898c: Assets and homepage design sync
- 062c190: feedback actions
- 21ba939: add magic numbers as constants
- a514f36: update app to use wagmi status sepolia config
- f63ff3c: update wallet connect
- Updated dependencies [d354913]
- Updated dependencies [264da50]
- Updated dependencies [6e65af8]
- Updated dependencies [4298940]
- Updated dependencies [8467e46]
- Updated dependencies [4740bd7]
- Updated dependencies [dc07597]
- Updated dependencies [b94eaff]
- Updated dependencies [8d4d607]
- Updated dependencies [0a14da4]
- Updated dependencies [8467e46]
- Updated dependencies [0fa9d76]
- Updated dependencies [d234d39]
- Updated dependencies [8467e46]
- Updated dependencies [fdc3fe9]
- Updated dependencies [57e6277]
- Updated dependencies [610315e]
- Updated dependencies [8467e46]
- Updated dependencies [e227e08]
- Updated dependencies [fda7e3b]
- Updated dependencies [fbec37a]
- Updated dependencies [bc65408]
- Updated dependencies [31f9b89]
- Updated dependencies [66d30c0]
- Updated dependencies [ee2a2bd]
- Updated dependencies [dbe7dae]
- Updated dependencies [adc8c21]
- Updated dependencies [af9e83f]
- Updated dependencies [563898c]
- Updated dependencies [ea4c192]
- Updated dependencies [dec09cf]
- Updated dependencies [dd59d1b]
- Updated dependencies [6598026]
- Updated dependencies [062c190]
- Updated dependencies [c7a6e71]
- Updated dependencies [8467e46]
- Updated dependencies [0c007f8]
- Updated dependencies [997b4a1]
  - @status-im/wallet@0.1.0
  - @status-im/components@1.1.0
  - @status-im/status-network@0.1.0
