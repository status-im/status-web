---
'@status-im/components': patch
'hub': major
---

### Staking & Vault Management System

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
