# @status-im/components

## 1.2.0

### Minor Changes

- ff8dd31: Add JSON-LD schema utilities to @status-im/components for SEO structured data

### Patch Changes

- be3d8dc: display tooltip on mobile

## 1.1.0

### Minor Changes

- 0a14da4: add import wallet flow

### Patch Changes

- 6e65af8: add received transaction history
- fdc3fe9: Updates toast to include blur
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

- 8467e46: Adds close toast action and multiple toasts

## 1.0.12

### Patch Changes

- Updated dependencies [1942ffb]
  - @status-im/icons@1.0.3

## 1.0.11

### Patch Changes

- 3c71b8c: update ESLint
- Updated dependencies [3c71b8c]
  - @status-im/colors@1.0.2
  - @status-im/icons@1.0.2

## 1.0.10

### Patch Changes

- 2fad122: use pnpm and update node
- e30555c: fix <DropdownMenu.SubTrigger /> icon; unknown network typo
- 3c968a2: add missing directive to `<SegmentedControl />`
- Updated dependencies [2fad122]
  - @status-im/colors@1.0.1
  - @status-im/icons@1.0.1

## 1.0.9

### Patch Changes

- 2c56ff2: adds segmented control to index file

## 1.0.8

### Patch Changes

- b159258: fix `<DropdownMenu.Item />` onSelect prop
- 4953fe7: adds segmented control component

## 1.0.7

### Patch Changes

- e9979fd: updates icon color for missing compound variants
- bf14368: add `type="account"` to `<ContextTag />`

## 1.0.6

### Patch Changes

- 7f21132: fix `<Shortcut />`icon prop and symbol centering

## 1.0.5

### Patch Changes

- 3ad28ea: chore: Remove flex-1 class from button component (#602)

## 1.0.4

### Patch Changes

- a3f9252: fix `<Button />` icon color for blur variant

## 1.0.3

### Patch Changes

- 8f1980e: Update fontSize in tailwind.config.ts

## 1.0.2

### Patch Changes

- 15c9640: Switch icon button from aria button to regular button

## 1.0.1

### Patch Changes

- 447cce7: fix `<DropdowMenu.SubTrigger />` expanded state
- 1ce026c: add `<DropdownMenu.Label />`
- 4e53b3e: Fix tag and tabs
- 273db4e: add dark grey dropdown button
- 4452f05: fix `<Button />` text alignment
- 433558a: Add `<Switch />` and `<DropdownMenu.SwitchItem />`

## 1.0.0

### Major Changes

- edfdfd6: switch to tailwind

### Patch Changes

- Updated dependencies [edfdfd6]
- Updated dependencies [c8f551f]
  - @status-im/colors@1.0.0
  - @status-im/icons@1.0.0

## 0.6.5

### Patch Changes

- 8540f86: draft: add disabled state to Tabs

## 0.6.4

### Patch Changes

- 1a17092: fix the color of the icon in IconButton

## 0.6.3

### Patch Changes

- 7093144: add size variants to Step

## 0.6.2

### Patch Changes

- 9a495fd: export `Tooltip`

## 0.6.1

### Patch Changes

- 70cb660: update avatar initials
- f9b9220: update toast options
- f6b7ca3: fix toast icon color

## 0.6.0

### Minor Changes

- b539321: fix copper color typo

## 0.5.2

### Patch Changes

- 7afc447: - Add tabs variants
  - Remove `backdrop-filter`

## 0.5.1

### Patch Changes

- 9d66ba0: Add `<Button />` blur subvariants

## 0.5.0

### Minor Changes

- 367145c: update `tamagui`

### Patch Changes

- Updated dependencies [367145c]
  - @status-im/icons@0.5.0

## 0.4.4

### Patch Changes

- d796765: sync colors
- 29b9734: add default curors to ContextTag

## 0.4.3

### Patch Changes

- 45be34b: set TabsTrigger cursor

## 0.4.2

### Patch Changes

- 2ac9665: fix Step spacing

## 0.4.1

### Patch Changes

- a159ac9: fix Tab icons color

## 0.4.0

### Minor Changes

- 19384e1: - upgrade storybook
  - fix text letter spacing
  - add text sizes

### Patch Changes

- a43b5a6: fix: keep icon color if defined as part of button
- b560d62: fix ContextTag style

## 0.3.2

### Patch Changes

- 024c19f: fix ContextTag text size

## 0.3.1

### Patch Changes

- 7c96dec: update Context Tag

## 0.3.0

### Minor Changes

- 762a698: add Step and Tabs with Step

## 0.2.5

### Patch Changes

- ea32fe1: release icons
- Updated dependencies [ea32fe1]
  - @status-im/icons@0.2.1

## 0.2.4

### Patch Changes

- 15b146f: use tamagui functional variants for Tag color
- 67a6846: [components] add dark theme variant

## 0.2.3

### Patch Changes

- ef5bf58: [components] export tabs

## 0.2.2

### Patch Changes

- c203e6f: export types

## 0.2.1

### Patch Changes

- 39462bf: export tokens

## 0.2.0

### Minor Changes

- 08791fc: include build step

### Patch Changes

- Updated dependencies [08791fc]
  - @status-im/colors@0.2.0
  - @status-im/icons@0.2.0

## 0.1.0

### Minor Changes

- 181faba: prepare packages for release

### Patch Changes

- Updated dependencies [181faba]
  - @status-im/colors@0.1.0
  - @status-im/icons@0.1.0
