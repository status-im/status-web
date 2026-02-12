# hub

## 1.1.0

### Minor Changes

- 69b8bce: fix: add locale support to canonical URLs for i18n SEO
  - Updated metadata generation to include locale prefix in canonical URLs (e.g., `/ko/pre-deposits` for Korean pages)
  - Refactored metadata generation to use shared utility from `@status-im/status-network/utils`
  - Ensured proper hreflang tags are generated for all locale-specific pages

- 4d178e5: feat: implement technical SEO improvements for i18n support
  - Enhanced sitemap configuration with static file exclusions and whitelist-based path filtering
  - Added hreflang tags (en, ko, x-default) to all pages for proper i18n SEO support
  - Extended metadata system to support pathname parameter for generating canonical URLs and language alternates
  - Created reusable get-pathname utility function to eliminate code duplication
  - Ensured all locale routes are properly included in sitemaps via explicit additionalPaths configuration

### Patch Changes

- 38f1aae: update page titles to prioritize 'Status Network' for improved branding consistency
- 97eb135: comment out KarmaButton components in TopBar for future adjustments
- 9f70c8c: feat(pre-deposit): add available ETH to wrap to WETH vault
- f32b4ec: chore(hub): enable back automatic vault disabling
- 0a601c4: add gusd breakdown to vault card
- 256d25c: chore: Update hub app page data
- 4bd5840: fix `apps/hub` og image ref
- be3d8dc: display tooltip on mobile
- 6ddb205: Enhance Karma overview card UI with improved progress tracking, user ranking display, and conditional color indicators for free transactions
- 3779226: Post release updates in SN hub
- 1100022: chore: update docs
- c0d67bb: add og metadata
- 04c980a: feat: add faq to predeposit page
- 1e38423: feat(hub): handle wallet can't switch chain error with a dialog
- e77bed6: fix: Karma tier progress fixed on point when tiers boundaries are equal
- 6a0e6b6: enable WETH vault
- 07e85e1: add i18n to apps/hub
- 06ceddc: Fix React Server Components CVE vulnerabilities
- e77bed6: withdraw
- 7e6817a: integrate KarmaButton components back into TopBar
- 7873e0a: feat: enable gusd vault
- 426051b: fix: rpc mainnet
- e77bed6: add app
- e77bed6: implement karma
- 1c12bd8: change order of the vaults
- e7a60f8: hotfix: enable all vaults by default
- 4e31984: feat: add feedback link to mobile
- e77bed6: feat: Add UI and hooks for pre-deposit functionality
- 4b9c6fc: Update vault card
- d292620: Refactor JSON-LD utilities with default values, add 410 Gone response handling for invalid paths, and implement technical SEO for the Status Network website
- 0a50862: Updates for Pre-deposits disclaimers
- e1181cd: chore: add generic points to modal
- 6d8a492: fix route auth session
- 5975aae: fix: zod version resolution
- 294450d: update order of the vaults
- 0e24ca7: add dynamic APY to pre-deposit modal
- afbdbe0: redirect `/dashboard` to `/`
- a1a20e4: fix: rpc mainnet
- d68c21e: feat: Add new apps to the hub
- 207f4a5: feat: add predeposit disclaimer
- 36502ad: update image alt texts for mobile app features in AppsPage and ImageType definition
- 154287d: feat: add KarmaButton component and integrate into TopBar
- e77bed6: Only show close button on rejected dialog and Compound initialize
- Updated dependencies [ff8dd31]
- Updated dependencies [b6eb665]
- Updated dependencies [03d2511]
- Updated dependencies [e0179d3]
- Updated dependencies [be3d8dc]
- Updated dependencies [06ceddc]
- Updated dependencies [e77bed6]
- Updated dependencies [e77bed6]
- Updated dependencies [d292620]
- Updated dependencies [0a50862]
- Updated dependencies [5975aae]
- Updated dependencies [4614fcc]
- Updated dependencies [207f4a5]
  - @status-im/components@1.2.0
  - @status-im/wallet@0.1.2
  - @status-im/status-network@0.1.2

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
