# hub

## 1.0.0

### Major Changes

- 66d30c07: ### Staking & Vault Management System

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

- e55e9987: generate `apps/hub`

### Patch Changes

- 732f9677: add unstaking support
- dc07597f: add wallet connect
- 0fa9d768: discover section
- 512c80c0: external links
- 8a3f4bea: set a max layout width for hub layout
- 4f209115: add amount validation util
- 563898cf: Assets and homepage design sync
- 062c1904: feedback actions
- 21ba9391: add magic numbers as constants
- a514f363: update app to use wagmi status sepolia config
- f63ff3cf: update wallet connect
- Updated dependencies [d3549134]
- Updated dependencies [264da507]
- Updated dependencies [6e65af8e]
- Updated dependencies [42989409]
- Updated dependencies [8467e461]
- Updated dependencies [4740bd7d]
- Updated dependencies [dc07597f]
- Updated dependencies [8d4d607a]
- Updated dependencies [0a14da44]
- Updated dependencies [8467e461]
- Updated dependencies [0fa9d768]
- Updated dependencies [d234d390]
- Updated dependencies [8467e461]
- Updated dependencies [fdc3fe99]
- Updated dependencies [57e62774]
- Updated dependencies [610315e7]
- Updated dependencies [8467e461]
- Updated dependencies [e227e089]
- Updated dependencies [fda7e3b0]
- Updated dependencies [fbec37a3]
- Updated dependencies [bc654086]
- Updated dependencies [31f9b897]
- Updated dependencies [66d30c07]
- Updated dependencies [ee2a2bdc]
- Updated dependencies [dbe7dae0]
- Updated dependencies [adc8c21d]
- Updated dependencies [af9e83f7]
- Updated dependencies [563898cf]
- Updated dependencies [ea4c1928]
- Updated dependencies [dec09cf9]
- Updated dependencies [dd59d1bf]
- Updated dependencies [6598026a]
- Updated dependencies [062c1904]
- Updated dependencies [c7a6e718]
- Updated dependencies [8467e461]
- Updated dependencies [0c007f85]
- Updated dependencies [997b4a13]
  - @status-im/wallet@0.1.0
  - @status-im/components@1.1.0
  - @status-im/status-network@0.0.2
