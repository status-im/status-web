type SeoOverride = {
  title: string
  description: string
}

export const SEO_OVERRIDES: Record<string, SeoOverride> = {
  '/': {
    title: 'Status App | Private Messenger, Web3 Wallet & Browser',
    description:
      'Own cryptocurrency and chat privately without surveillance. Combine censorship resistant communications with decentralized finance tools in one secure app.',
  },
  '/security': {
    title: 'Security Protocols for Status Secure Messenger App',
    description:
      'Review Status App commitment to code safety and cryptography. Learn how to submit zero-day bug reports directly to Status App open source engineering team.',
  },
  '/translations': {
    title: 'Help Translate Status Decentralized Messenger Client',
    description:
      'Contribute to global digital freedom by adapting Status App software interface into new languages. Join Status App volunteer localization program today.',
  },
  '/jobs': {
    title: 'Open Roles: Build Status Censorship Resistant P2P Chat',
    description:
      'Contribute to secure communication tools. Review current job openings across engineering and operations for the global remote cryptocurrency organization.',
  },
  '/keycard': {
    title: 'Get a Keycard to Secure Your Open Source Web3 Wallet',
    description:
      'Order the secure contactless smartcard. Authorize transactions with a simple tap & keep private keys physically isolated from internet vulnerable devices.',
  },
  '/manifesto': {
    title: 'App Manifesto: Censorship Resistant Messaging Tools',
    description:
      'Read the core philosophy on digital sovereignty. We build private messaging app features to protect communication and defend global human rights online.',
  },
  '/team': {
    title: 'Meet the Contributors Building Status Web3 Wallet App',
    description:
      'We are a global group of ninety builders defending human rights. Learn about the organizational structure of the censorship resistant text messaging team.',
  },
  '/brand': {
    title: 'Official Brand Assets for the Status Messenger App',
    description:
      'Access Status App visual identity guidelines. Retrieve approved visual files of the secure messenger logo, wordmark, and specific color palettes for media.',
  },
  '/blog': {
    title: 'Blog: Updates on Permissionless & Secure Status App',
    description:
      'Read deep dives into cryptography and human rights. Stay current with software releases and technical notes for your secure non-custodial crypto wallet.',
  },
  '/learn': {
    title: 'Learn: Guides to Privacy, Security & Open Technology',
    description:
      'In-depth technical content on privacy, cryptography, secure messaging, distributed networks, and the systems powering open communication technologies.',  // ← COMMA NEEDED HERE
  },
  '/apps': {
    title: 'Download the Status Desktop App and Mobile App Suite',
    description:
      'Access your secure chat and web3 wallet on the go or at your desk. Connect to decentralized applications using iOS, Android, macOS, Windows, and Linux.',
  },
  '/snt': {
    title: 'SNT Community Token for Web3 Chat and Crypto Wallet',
    description:
      'Vote on development priorities and reserve ENS names. Hold the native utility asset to participate directly in decentralized governance decisions securely.',
  },
  '/snt/exchanges': {
    title: 'Crypto Exchanges List for the Status Open Source App',
    description:
      'Find platforms supporting the app utility token. Review centralized and decentralized markets offering liquidity, trading pairs, and volume for SNT tokens.',
  },
  '/snt/release-schedule': {
    title: 'SNT Token Release Schedule for Status Open Source App',
    description:
      'Review the long-term circulation timeline for the utility asset. Track historical genesis block distributions & future unvesting milestones for the supply.',
  },
  '/legal/terms-of-use': {
    title: 'Terms of Use Rules for Status P2P Chat App and Wallet',
    description:
      'Read the governing conditions for utilizing decentralized software. Review liability limits, strict user obligations, and intellectual property guidelines.',
  },
  '/legal/privacy-policy': {
    title: 'Privacy Policy for Status Private Messaging App Tools',
    description:
      'Understand exactly what limited diagnostics the application gathers. Review how we protect user anonymity and handle third-party integrations securely.',
  },
  '/insights/epics': {
    title: 'App Development Epics: Open Source Web3 App Status',
    description:
      'Track engineering progress for the private messaging app. Review active coding phases & technical milestones for secure decentralized communication tools.',
  },
  '/help': {
    title: 'Support Guides for the Status Secure Messenger App',
    description:
      'Browse short tutorials covering profile setup and security best practices. Troubleshoot features across Status App private messaging app and crypto wallet.',
  },
  '/specs': {
    title: 'Technical Specs: Status Encrypted Messaging Protocol',
    description:
      'Review the underlying architecture of secure communication tools. Read detailed documentation on the Waku protocol and safe cryptographic implementations.',
  },

  // Specs articles
  '/specs/status-payloads': {
    title: 'Payloads Specifications for Status P2P Chat App Routing',
    description:
      'Analyze structural compositions of messages sent across the peer-to-peer chat network. Review encryption wrappers and metadata handling for client software',
  },
  '/specs/status-simple-scaling': {
    title: 'Simple Scaling Specifications for Status P2P Chat App',
    description:
      'Technical documentation on managing node bandwidth. Review protocols designed to maintain message delivery speeds as the decentralized user base scales.',
  },
  '/specs/status-featuring': {
    title: 'Status Featuring Specs: Open Source Web3 App Rules',
    description:
      'Examine the technical mechanisms for promoting groups in the public directory. Review SNT staking requirements & network search visibility algorithms now.',
  },
  '/specs/status-community-history-service': {
    title: 'Community History Service Specs for Status P2P Chat App',
    description:
      'Review the technical protocols archiving decentralized chat logs. Understand how torrent structures distribute past message payloads to new group members.',
  },
  '/specs/status-curation': {
    title: 'Curation Specs for the Status Open Source Web3 App',
    description:
      'Technical docs detailing how users vote to feature specific communities. Review the smart contract logic behind token-weighted search ranking algorithms.',
  },
  '/specs/status-account-address': {
    title: 'Account Address Cryptography for Status P2P Chat App',
    description:
      'Review the technical derivation path linking Ethereum keypairs to network chatkeys. Understand how private identities are generated on your local device.',
  },
  '/specs/status-keycard-usage': {
    title: 'Keycard Hardware Integration Specs: Open Source App',
    description:
      'Technical overview of APDU commands and JavaCard applets. Understand how the mobile application securely bridges private key signatures via NFC signals.',
  },
  '/specs/status-1to1-chat': {
    title: '1-to-1 Chat Specifications: Encrypted Messaging App',
    description:
      'Review the cryptographic foundations of direct messaging. Understand how perfect forward secrecy is maintained across distributed P2P node chat relays.',
  },
  '/specs/status-communities': {
    title: 'Communities Specifications for Decentralized Groups',
    description:
      'Technical documentation defining the hierarchical structure of decentralized rooms. Read about role-based access controls and cryptographic state data.',
  },

  // Help articles
  '/help/wallet/buy-snt': {
    title: 'How to Buy SNT Inside Status Web3 Wallet Mobile App',
    description:
      'Acquire SNT tokens directly via integrated fiat gateways. Review available payment methods and routing options for safe cryptocurrency purchases on mobile.',
  },
  '/help/keycard': {
    title: 'Keycard Beta Guide for Secure Non-Custodial Wallet',
    description:
      'Instructions for linking the physical smartcard to mobile devices. Enable contactless authorizations for cryptocurrency transactions and secure app logins.',
  },
  '/help/messaging': {
    title: 'Guide to Anonymous Chat, Where No Phone Number Required',
    description:
      'Master the encrypted chat interface. Find instructions for starting one-on-one conversations, sharing files securely, and configuring private P2P routing.',
  },
  '/help/getting-started/download-status-for-mac': {
    title: 'Download Status Open Source Web3 Messenger App for Mac',
    description:
      'Install the unified Web3 App on macOS environments. Run full communication nodes directly from Apple computers and safely manage digital crypto assets.',
  },
  '/help/getting-started/invite-friends-to-status': {
    title: 'Invite Friends to Use Censorship Resistant & Free Chat',
    description:
      'Share unique profile links to onboard new users. Help expand decentralized app by routing contacts to official open-source mobile application downloads.',
  },
  '/help/keycard/keycard-faq': {
    title: 'Keycard FAQ: Your Private Non-Custodial Crypto Wallet',
    description:
      'Find answers regarding NFC compatibility, physical security standards & troubleshooting connection errors for transaction authorization smartcards easily.',
  },
  '/help/getting-started/what-is-status': {
    title: 'What is Status? Secure, Private Messenger & Web3 Wallet',
    description:
      'Learn the core features of the open-source platform. Combine private messaging, self-custody asset management & dApp browsing into one secure mobile app.',
  },
  '/help/messaging/join-a-group-chat': {
    title: 'Join an Encrypted Group Chat on Status P2P Chat App',
    description:
      'Accept incoming invitations to multi-user conversations. Verify participants & begin exchanging secure media within the decentralized text messaging rooms.',
  },
  '/help/messaging/send-gifs-and-stickers': {
    title: 'Send GIFs and Stickers in Status Private Messaging App',
    description:
      'Access the decentralized sticker marketplace to insert animated media into your chat feeds directly. Communicate visually in encrypted chat conversations.',
  },
  '/help/wallet/about-the-status-snt-token': {
    title: 'About the Status SNT Token: Web3 Wallet Utility Asset',
    description:
      'Understand the core asset driving the decentralized ecosystem. Learn how holding SNT enables ENS name registration, app curation & safe governance voting.',
  },
  '/help/getting-started/download-status-for-linux': {
    title: 'Download the Status P2P Chat App Client for Linux OS',
    description:
      'Install the unified Web3 suite on preferred Linux Machine. Compile from source or download secure binaries to run independent network nodes on desktop.',
  },
  '/help/wallet/add-missing-accounts-after-importing-a-wallet': {
    title: 'Add Missing Accounts After Importing Status Web3 Wallet',
    description:
      'Restore secondary derivation paths safely. Force local client interfaces to scan blockchains for previously used public addresses linked to master seeds.',
  },
  '/help/communities/about-the-management-roles-in-status-communities': {
    title: 'About The Management Roles in Status Web3 Communities',
    description:
      'Review specific hierarchies embedded in decentralized group smart contracts. Understand explicit capabilities dividing standard users & web3 group admins.',
  },
  '/help/keycard/factory-reset-your-keycard': {
    title: 'Factory Reset Your Keycard Secure Hardware Wallet App',
    description:
      'Wipe all cryptographic applets and stored keys from physical smartcards. Prepare hardware devices for safe resale or full reassignment to new web3 wallets.',
  },
  '/help/profile/your-chatkey-emojihash-and-identicon-ring': {
    title: 'Chatkeys, Emojihashes, and Identicon Rings in Status',
    description:
      'Master unique decentralized network identifiers. Learn how peer-to-peer protocols generate reliable visual representations of complex strings to stop scam.',
  },
  '/help/wallet/understand-fund-transfers-in-dapp-transactions': {
    title: 'Understand Fund Transfers in dApp Web3 Transactions',
    description:
      'Analyze complex smart contract routing behaviors. Identify how decentralized exchanges batch token approvals & liquidity movements in single app payloads.',
  },
  '/help/messaging/search-for-conversations-and-messages-in-status': {
    title: 'Search for Conversations and Messages in Status App',
    description:
      'Navigate extensive encrypted chat histories quickly. Utilize local indexing to retrieve critical historical data payloads without querying external server.',
  },
  '/help/profile/add-or-remove-a-nickname-from-someone-else-s-profile': {
    title: "Add or Remove Nicknames From Someone Else's Profile",
    description:
      'Manage localized encrypted address books efficiently. Apply custom human-readable labels to complex hexadecimal identities to prevent severe routing error.',
  },
  '/help/communities/how-to-grant-the-tokenmaster-role-in-your-community': {
    title: 'How to Grant TokenMaster Roles in Web3 Communities',
    description:
      'Promote trusted users securely via smart contract executions. Mint administrative assets directly to wallet addresses to assign strict moderation controls.',
  },
  '/help/wallet/understand-your-transaction-details': {
    title: 'Understand Ethereum Transaction Details in Web3 Wallets',
    description:
      'Read advanced blockchain data safely. Decipher exact network fee breakdowns, contract interaction hashes, and precise block timestamps for crypto transfer.',
  },
  '/help/profile/register-an-ens-name-in-status': {
    title: 'Register ENS Names Inside Status Private Web3 Wallet',
    description:
      'Claim human-readable Ethereum usernames directly in the interface. Replace complex hexadecimal strings with simple domains to receive crypto funds safely.',
  },
  '/help/messaging/remove-members-from-a-group-chat': {
    title: 'Remove Members From Encrypted Status Group Chat Session',
    description:
      'Revoke access to multi-user conversations. Understand how encryption keys cycle to prevent removed individuals from reading future text message payloads.',
  },
  '/help/communities/about-community-request-approvals': {
    title: 'Community Request Approval Guide within Status App',
    description:
      'Understand the manual onboarding queue for private groups. Learn how administrators review incoming member applications before granting app network access.',
  },
  '/help/getting-started/privacy-with-status-third-parties': {
    title: 'Privacy With Status Third Parties & Decentralized Apps',
    description:
      'Review data sharing boundaries when using external integrations. Understand exactly what public wallet info is exposed when connecting to safe Web3 sites.',
  },
  '/help/getting-started/uninstall-status-desktop': {
    title: 'Uninstall Securely Private Status App from Your Desktop',
    description:
      'Remove all core software files and local node databases from your machine. Ensure your private recovery phrase is physically backed up before app deletion.',
  },
  '/help/wallet/understand-network-fees': {
    title: 'Understand Ethereum Network Fees in Status Web3 Wallet',
    description:
      'Learn why gas is required for Ethereum transactions. Review how base fee algorithms fluctuate based on current blockchain congestion and block utilization.',
  },
  '/help/communities/join-a-status-community': {
    title: 'Join a Token-Gated Community in Status Web3 Chat App',
    description:
      'Request entry to decentralized social groups. Verify your digital asset holdings to satisfy smart contract requirements and unlock hidden discussion feeds.',
  },
  '/help/communities/leave-a-status-community': {
    title: 'Leave a Web3 Community and Remove Encrypted Chat Logs',
    description:
      'Disconnect from a decentralized social group permanently. Halt all incoming network traffic from associated channels and safely purge the local data feeds.',
  },
  '/help/messaging/add-a-contact-in-status': {
    title: 'Add a Trusted Contact to Your Decentralized Messenger',
    description:
      'Save complex public keys using human-readable nicknames. Streamline future encrypted messaging and secure asset transfers by building a local address book.',
  },
  '/help/messaging/close-a-chat-with-someone': {
    title: 'Close a Direct Chat in the Status Encrypted Messenger',
    description:
      'Hide an inactive one-on-one conversation from your main screen. Understand how closing differs from deleting to preserve the local cryptographic histories.',
  },
  '/help/wallet/about-swap-and-bridge-fees': {
    title: 'About Swap and Bridge Fees in Your Secure Web3 Wallet',
    description:
      'Break down the costs associated with decentralized trading. Distinguish between base network gas and the percentage-based liquidity provider routing tolls.',
  },
  '/help/communities/about-the-control-node-in-status-communities': {
    title: 'About Control Nodes in Decentralized Chat Communities',
    description:
      'Understand central architectural pillars of decentralized groups. Learn how specific hardware retains chat history and enforces core governance parameters.',
  },
  '/help/communities/common-issues-when-the-community-s-control-node-is-offline':
    {
      title: 'Common Issues When Community Control Nodes Go Offline',
      description:
        'Troubleshoot severe localized group outages safely. Understand why chat history fails to sync and member directories break when hosting hardware goes down.',
    },
  '/help/communities/grant-exclusive-access-with-tokens': {
    title: 'Grant Exclusive Access With Community Utility Tokens',
    description:
      'Automate group membership using smart contracts. Issue custom digital assets to dedicated users, granting entry to heavily restricted administrative areas.',
  },
  '/help/wallet/if-you-see-transactions-you-don-t-recognize': {
    title: 'Troubleshoot Unrecognized Crypto Wallet Transactions',
    description:
      'Audit local blockchain history safely. Determine if unexpected outgoing transfers represent malicious drains, smart contract bugs, or token airdrop events.',
  },
  '/help/communities/understand-the-owner-and-tokenmaster-tokens': {
    title: 'Understand Owner and TokenMaster Tokens in Web3 Chat',
    description:
      'Analyze foundational community smart contracts. Review specific cryptographic powers granted to genesis wallets and nodes handling daily admin group rules.',
  },
  '/help/communities/change-who-can-pin-messages-in-your-community': {
    title: 'Change Who Can Pin Messages in Web3 Chat Communities',
    description:
      'Adjust granular administrative capabilities reliably. Revoke or assign power to highlight critical group announcements by modifying role based permissions.',
  },
  '/help/keycard/import-a-wallet-account-from-another-app-onto-keycard-and-use-it-in-status':
    {
      title: 'Import Wallet Accounts From Another App Onto Keycard',
      description:
        'Migrate external seed phrases to physical smartcards safely. Secure previously vulnerable software keys by injecting them directly into NFC hardware chips.',
    },
  '/help/communities/customize-your-channel': {
    title: 'Customize a Channel in Your Decentralized Messenger',
    description:
      'Update the display name, descriptive text, and localized icon for specific discussion rooms. Ensure members understand the unique purpose of the new space.',
  },
  '/help/communities/delete-a-channel': {
    title: 'Delete a Community Channel in Private Messaging App',
    description:
      'Instructions for administrators to permanently remove topic rooms. Understand the consequences for message history and active user participation workflows.',
  },
  '/help/keycard/back-up-to-an-additional-keycard': {
    title: 'Back Up Accounts to Additional Keycard Hardware App',
    description:
      'Duplicate cryptographic credentials across multiple hardware devices. Securely clone master seed phrases to ensure physical redundancy if one card is lost.',
  },
  '/help/getting-started/understand-your-actions-in-status': {
    title: 'Understand Cryptographic Actions in the Web3 Client',
    description:
      'Differentiate between free local changes and paid blockchain transactions. Learn which application settings require Ethereum gas fees to broadcast cleanly.',
  },
  '/help/communities/kick-or-ban-someone-from-your-community': {
    title: 'Kick or Ban Someone From Web3 Chat Communities Fast',
    description:
      'Remove malicious actors from decentralized groups. Execute manual expulsions to clear active sessions, and apply permanent bans preventing network reentry.',
  },
  '/help/profile/take-a-screenshot-in-the-status-mobile-app': {
    title: 'Take Screenshots Safely in the Status Mobile Client',
    description:
      'Navigate platform specific security restrictions. Understand how Android operating systems block interface captures to stop malware stealing recovery keys.',
  },
  '/help/getting-started/privacy-with-status-infrastructure-and-insights': {
    title: 'Privacy With Status Infrastructure and App Insights',
    description:
      'Review precisely what localized metrics application software transmits. Understand strict commitments to anonymized analytics ensuring chat data is hidden.',
  },
  '/help/wallet/buy-crypto': {
    title: 'Buy Crypto Within the Best Web3 Wallet for Android',
    description:
      'Fund your digital accounts using integrated third-party payment processors. Convert traditional fiat money into digital assets without leaving your wallet.',
  },
  '/help/communities/join-a-community-on-status-web': {
    title: 'Join Web3 Chat Communities via the Desktop Browser',
    description:
      'Access decentralized social groups through standard desktop screens. Connect via WalletConnect to verify token balances without installing mobile software.',
  },
  '/help/profile/transfer-your-ens-name-to-status': {
    title: 'Transfer Existing ENS Names to the Status Web3 App',
    description:
      'Migrate personalized Ethereum domains into the ecosystem. Map decentralized usernames to direct chatkeys for streamlined messaging and asset token routing.',
  },
  '/help/communities/channels-your-quick-start-guide': {
    title: 'Channels Quick Start Guide for Web3 Community Apps',
    description:
      'Organize decentralized groups effectively. Learn how to launch specialized topic rooms, set initial access controls, and guide member conversations safely.',
  },
  '/help/keycard/create-a-replacement-for-your-lost-keycard': {
    title: 'Create Replacements for Lost Keycard Hardware Apps',
    description:
      'Restore physical security access quickly. Learn how to import paper master phrases onto fresh smartcard hardware without exposing foundational crypto keys.',
  },
  '/help/profile/configure-community-and-channel-notifications': {
    title: 'Configure Community and Channel Push Notifications',
    description:
      'Master group alert parameters on localized devices. Silence high-traffic public lobbies while ensuring notifications trigger for specific keyword mentions.',
  },
  '/help/profile/remove-a-status-profile-from-your-profile-list': {
    title: 'Remove Status Profiles From the App Startup Screen',
    description:
      'Erase specific secondary accounts from local database memory. Maintain privacy on shared physical devices by deleting dormant or strict financial profiles.',
  },
  '/help/wallet/remove-a-wallet-account-from-your-status-wallet': {
    title: 'Remove Wallet Accounts From the Secure Web3 Client',
    description:
      'Hide specific public addresses from daily interfaces. Organize self-custody portfolios by visually purging zero-balance keys from mobile application feeds.',
  },
  '/help/keycard/stop-using-keycard-for-your-wallet-account-or-profile': {
    title: 'Stop Using Keycard for Wallet Accounts or Profiles',
    description:
      'Detach physical hardware requirements from mobile software securely. Revert back to local application passwords for transaction authorizations immediately.',
  },
  '/help/wallet/save-a-wallet-address': {
    title: 'Save Custom Wallet Addresses in Status Web3 Browser',
    description:
      'Store frequently used hexadecimal public keys locally. Build a trusted contact list to streamline future cryptocurrency transfers and minimize data errors.',
  },
  '/help/wallet/bridge-crypto-in-status-wallet': {
    title: 'Bridge Crypto Across Networks within Web3 Wallet Apps',
    description:
      'Transfer digital assets between independent blockchain ecosystems. Use integrated protocols to move value securely from Ethereum Mainnet to Layer 2 chains.',
  },
  '/help/communities/import-tokens-to-your-community': {
    title: 'Import Existing Tokens into Your Web3 Chat Communities',
    description:
      'Integrate previously minted ERC-20 assets into new decentralized groups. Use established external economies to configure strict internal access conditions.',
  },
  '/help/profile/secure-your-information-and-funds': {
    title: 'Secure Your Information and Funds in the Web3 Chat App',
    description:
      'Master basic operational security for decentralized software. Protect physical devices, safeguard recovery seeds, and avoid malicious network actors fully.',
  },
  '/help/messaging/react-and-reply-to-messages': {
    title: 'React and Reply in Censorship Resistant Messaging App',
    description:
      'Acknowledge incoming texts instantly using decentralized emoji reactions. Maintain organized discussion threads by linking responses to specific payloads.',
  },
  '/help/messaging/add-members-to-a-group-chat': {
    title: 'Add New Members to a Group Chat in Status Web3 Chat',
    description:
      'Expand private conversations by distributing shared encryption keys to new participants. Review the security risks of exposing previous chat context data.',
  },
  '/help/messaging/create-a-group-chat': {
    title: 'Create a Private Group Chat Inside Status P2P Chat App',
    description:
      'Start a new encrypted conversation with multiple contacts simultaneously. Manage the initial participant list and assign an identifiable name to the room.',
  },
  '/help/wallet/understand-coins-and-tokens': {
    title: 'Understand Coins vs Tokens in Status Secure ETH Wallet',
    description:
      'Learn the technical distinction between native blockchain assets and smart contract derivatives. Avoid common bridging errors when managing digital funds.',
  },
  '/help/wallet/back-up-your-wallet-accounts': {
    title: 'Back Up Your Multi-Chain Wallet Accounts Safely Offline',
    description:
      'Write down your twelve word master recovery phrase. Learn why physical paper backups are critical to prevent total loss of decentralized financial assets.',
  },
  '/help/profile/customize-membership-request-notifications': {
    title: 'Customize Membership Request Notifications in Status',
    description:
      'Filter automated alerts generated by community applications. Prevent administrative fatigue by batching network pings or silencing group approval prompts.',
  },
  '/help/wallet/about-your-multi-chain-and-legacy-addresses': {
    title: 'About Multi-Chain and Legacy Addresses in Status App',
    description:
      'Navigate complex derivation path histories. Understand why older Ethereum configurations generate different public receiving codes to access legacy funds.',
  },
  '/help/keycard/change-your-keycard-pin': {
    title: 'Change Your Keycard PIN for Your Open Source Wallet',
    description:
      'Update the six-digit numerical code required to authorize local actions. Maintain physical security by rotating your authentication credentials routinely.',
  },
  '/help/wallet/cancel-transactions': {
    title: 'Cancel Pending Ethereum Wallet App Transactions Now',
    description:
      'Attempt to halt delayed blockchain transfers before they confirm. Learn how to broadcast a replacement payload using identical nonces and higher gas fees.',
  },
  '/help/profile/enable-biometrics-for-your-status-profile': {
    title: 'Enable Biometrics for the Status Profile Mobile App',
    description:
      'Secure local interfaces using fingerprint or facial recognition software. Streamline app unlocking while ensuring decentralized identities stay protected.',
  },
  '/help/communities/understand-token-requirements-in-communities': {
    title: 'Understand Token Requirements in Status Communities',
    description:
      'Analyze overarching group access parameters carefully. Ensure smart contract mechanisms verify local asset balances before granting chat read permissions.',
  },
  '/help/communities/choose-the-network-for-your-airdrop-campaign': {
    title: 'Choose Blockchain Networks for Token Airdrop Events',
    description:
      'Calculate deployment expenses before minting tokens. Compare Layer 1 security guarantees against Layer 2 transactional speeds to optimize smart contracts.',
  },
  '/help/communities/change-the-wallet-account-you-share-with-a-community': {
    title: 'Change Wallet Accounts Shared With Web3 Communities',
    description:
      'Switch public addresses interacting with decentralized groups securely. Route social identities to fresh keypairs to compartmentalize financial histories.',
  },
  '/help/wallet/create-wallet-accounts': {
    title: 'Create Multiple Accounts in Your Secure ETH Wallet',
    description:
      'Generate separate public addresses under one master recovery phrase. Isolate your decentralized finance activities to organize your digital asset library.',
  },
  '/help/communities/how-to-airdrop-tokens-in-status': {
    title: 'How to Airdrop Tokens in Decentralized Communities',
    description:
      'Distribute digital assets directly to active group members. Execute bulk transfers via smart contracts to bootstrap governance and reward chat engagement.',
  },
  '/help/wallet/delete-your-status-wallet-accounts': {
    title: 'Delete Status Wallet Accounts From Local App Files',
    description:
      'Remove specific public addresses from active interfaces. Understand why this action hides visual data while blockchain histories remain totally immutable.',
  },
  '/help/communities/vote-to-feature-a-status-community': {
    title: 'Vote to Feature Status Communities With SNT Tokens',
    description:
      'Use network tokens to influence public directory rankings. Learn the staking mechanics behind the decentralized curation protocol to support great groups.',
  },
  '/help/wallet/add-watch-only-accounts': {
    title: 'Add Watch-Only Accounts in the Ethereum Wallet App',
    description:
      'Monitor external public addresses securely. Track real-time financial portfolios of decentralized autonomous organizations without importing private keys.',
  },
  '/help/keycard/secure-your-status-profile-or-wallet-with-keycard': {
    title: 'Secure Status Profiles or Wallets With Keycard App',
    description:
      'Enhance mobile software protection via external hardware. Require physical localized smartcard NFC taps to authorize critical blockchain crypto transfers.',
  },
  '/help/communities/examples-of-token-based-access-in-communities-and-channels':
    {
      title: 'Examples of Token-Based Access in Web3 Communities',
      description:
        'Review successful architectural models for decentralized governance. Analyze how prominent network groups utilize NFTs and ERC-20 balances to build tiers.',
    },
  '/help/communities/choose-the-wallet-account-address-you-share-with-a-community':
    {
      title: 'Choose Wallet Account Addresses Shared With Groups',
      description:
        'Select specific cryptographic profiles for public interactions safely. Mask primary financial holdings by linking secondary addresses to active chat hubs.',
    },
  '/help/communities': {
    title: 'Communities Beta Guide: Manage Web3 Chat Channels',
    description:
      'Launch and moderate decentralized social spaces. Configure member permissions, establish channel structures, and deploy custom governance rules for users.',
  },
  '/help/communities/leave-a-channel': {
    title: 'How to Leave a Channel in Status Web3 Chat Groups App',
    description:
      'Remove specific discussion rooms from your active chat feed. Unsubscribe from local notifications without abandoning the broader token-gated parent group.',
  },
  '/help/getting-started': {
    title: 'Getting Started Guide for Decentralized Messenger App',
    description:
      'Initialize your decentralized identity. Learn how to generate a secure recovery phrase, configure local passwords, and enter the private messaging system.',
  },
  '/help/profile/customize-your-status-profile': {
    title: 'Customize Public Profiles within the Web3 Chat Client',
    description:
      'Update public-facing decentralized identities. Change display nicknames and adjust privacy configurations to control how others discover network accounts.',
  },
  '/help/keycard/about-your-keycard-pin-and-puk': {
    title: 'Keycard PIN and PUK Master Codes for Secure Status App',
    description:
      'Understand localized security layers protecting hardware wallets. Review differences between daily transaction authorizations and complete reset recovery.',
  },
  '/help/communities/set-up-your-channel-permissions': {
    title: 'Set Up Channel Permissions within Status Web3 Chat',
    description:
      'Define exact access levels for specific community rooms. Toggle reading, writing, and administrative functions to establish structured internal hierarchy.',
  },
  '/help/communities/set-up-your-community-permissions': {
    title: 'Set Up Community Permissions in Private Web3 Chat App',
    description:
      'Define global administrative rules for decentralized groups. Restrict who can mint governance tokens, ban disruptive users, and alter smart contract code.',
  },
  '/help/communities/how-to-use-status-communities-your-quick-start-guide': {
    title: 'How to Use Status Communities: Your Quick Start Guide',
    description:
      'Navigate decentralized social platforms properly. Master the basics of verifying asset balances for entry, understanding governance, and joining channels.',
  },
  '/help/wallet/customize-your-wallet-account': {
    title: 'Customize Status Web3 Wallet Accounts and Visual Labels',
    description:
      'Assign personalized color labels and human-readable names to complex hexadecimal addresses. Prevent operational errors by separating crypto funds clearly.',
  },
  '/help/communities/how-to-run-a-status-community-your-quick-start-guide': {
    title: 'How to Run a Web3 Status Community: Quick Start Guide',
    description:
      'Launch and moderate decentralized groups efficiently. Follow foundational tutorials covering initial smart contract deployment and channel administration.',
  },
  '/help/getting-started/third-party-tools-disclaimer-and-user-responsibility':
    {
      title: 'Third-Party Tools Disclaimer and User Responsibility',
      description:
        'Review critical legal boundaries regarding external decentralized applications. Understand that Status cannot reverse malicious smart contract executions.',
    },
  '/help/profile/share-your-status-profile': {
    title: 'Share Your Profile & Unique Chatkey in Status Web3 App',
    description:
      'Distribute your public identifier to initiate secure conversations. Generate a personalized QR code or copy the alphanumeric hash to post on any website.',
  },
  '/help/wallet/send-crypto-to-someone': {
    title: 'Send Crypto Privately in Status Multi-Chain Wallet',
    description:
      'Broadcast digital assets to external public addresses or internal contacts. Review how to adjust network fee speeds and verify transaction hashes safely.',
  },
  '/help/communities/about-view-only-channels': {
    title: 'About View-Only Channels in Status Web3 Chat App Groups',
    description:
      'Understand restricted broadcasting rooms. Learn how administrators deploy read-only interfaces to share official announcements without general chat spam.',
  },
  '/help/messaging/share-images-in-status': {
    title: 'Share Images Securely in Status Encrypted Messaging App',
    description:
      'Send photos without exposing metadata to corporate servers. Learn file size limits and compression standards used across decentralized storage protocols.',
  },
  '/help/messaging/send-and-read-messages': {
    title: 'Send and Read Texts via Status Secure Messenger App',
    description:
      'Navigate the core text interface. Learn how to verify delivery statuses, parse incoming communication requests, and respond securely to network contacts.',
  },
  '/help/wallet/bridge-and-swap-scenarios': {
    title: 'Bridge and Swap Scenarios for Status Ethereum Wallet',
    description:
      'Determine the best financial routes for your digital assets. Compare the costs of moving liquidity between Layer 2 networks versus Layer 1 chain trading.',
  },
  '/help/wallet/import-missing-private-keys-and-key-pairs-on-multiple-devices':
    {
      title: 'Import Missing Private Keys on Multiple Mobile Devices',
      description:
        'Synchronize isolated accounts across local hardware securely. Manually transfer specific hexadecimal strings to ensure secondary phones reflect balances.',
    },
  '/help/keycard/if-you-lose-your-keycard': {
    title: 'If You Lose Your Keycard Non-Custodial Crypto Wallet',
    description:
      'Follow emergency procedures to secure your funds if your physical device is missing. Learn how to quickly restore accounts using a paper recovery phrase.',
  },
  '/help/wallet/how-wallet-accounts-keys-and-derivation-paths-work': {
    title: 'How Wallet Accounts, Keys, and Derivation Paths Work',
    description:
      'Master the underlying mathematics of self-custody safely. Track how singular master sequences deterministically generate thousands of isolated addresses.',
  },
  '/help/messaging/mention-people-in-status': {
    title: 'Use User Mentions in Censorship Resistant Messaging',
    description:
      'Tag specific participants directly within active chat rooms. Trigger custom push notifications to ensure they see your targeted question or vital update.',
  },
  '/help/communities/understand-token-requirements-in-channels': {
    title: 'Understand Token Requirements in Web3 Chat Channels',
    description:
      'Review smart contract logic governing automated chat access. Learn how verifying asset balances enforces exclusive membership rules across digital rooms.',
  },
  '/help/wallet/understand-transaction-confirmations-and-statuses': {
    title: 'Understand Crypto Transaction Confirmations in Apps',
    description:
      'Monitor digital asset transfers precisely. Decipher complex blockchain explorer terminology to determine if payloads are queued or permanently finalized.',
  },
  '/help/wallet/create-a-wallet-account-with-a-custom-derivation-path': {
    title: 'Create Wallet Accounts With Custom Derivation Paths',
    description:
      'Generate advanced non-standard cryptographic addresses securely. Manually configure node logic to access specific legacy funds or isolate vault activity.',
  },
  '/help/getting-started/download-status-for-windows': {
    title: 'Download the Status Web3 App Client for Windows OS',
    description:
      'Install the unified Web3 platform on your Microsoft machine. Run a censorship resistant node directly from your desktop and manage assets via a local UI.',
  },
  '/help/profile/verify-your-contacts-identity': {
    title: 'Verify Contact Identity Using Web3 Identicon Rings',
    description:
      'Prevent impersonation attacks using visual cryptographic hashing. Cross-reference unique color patterns to ensure communication with the correct profile.',
  },
  '/help/profile/your-status-notifications-guide': {
    title: 'Status Notifications Guide: Manage P2P Chat Alerts',
    description:
      'Master local device alert systems. Understand the difference between global push notifications, background sync updates, and direct peer-to-peer pinging.',
  },
  '/help/profile/view-and-edit-your-status-profile': {
    title: 'View and Edit Public Profiles in the Messenger App',
    description:
      'Modify identity information broadcast to the peer-to-peer network. Update bios, change display pictures, and manage linked Ethereum Name Service domains.',
  },
  '/help/communities/about-the-different-types-of-status-communities': {
    title: 'About the Different Types of Web3 Chat Communities',
    description:
      'Compare standard public groups against highly restricted token-gated organizations. Evaluate which architectural models best suit exact security demands.',
  },
  '/help/communities/about-voting-to-change-the-community-visibility': {
    title: 'About Voting to Change Web3 Community Visibilities',
    description:
      'Understand community-driven governance protocols safely. Review how utilizing SNT limits central administrative power to alter public directory indexing.',
  },
  '/help/profile/understand-your-status-keys-and-recovery-phrase': {
    title: 'Understand Status Keys and Wallet Recovery Phrases',
    description:
      'Grasp the foundational math of digital autonomy. See how randomized words mathematically generate every wallet address and peer-to-peer network identity.',
  },
  '/help/communities/customize-your-community': {
    title: 'Customize Your Web3 Community Brand Assets within App',
    description:
      'Modify the overarching aesthetics of your decentralized group. Upload a new global logo, craft an engaging bio, and structure the main navigation banner.',
  },
  '/help/wallet/about-your-status-signing-phrase': {
    title: 'About Status Web3 Wallet Transaction Signing Phrases',
    description:
      'Understand the three random words displayed during transaction approvals. Learn how localized security checks prevent malicious apps spoofing signatures.',
  },
  '/help/profile/understand-status-profile-labels': {
    title: 'Understand Status App Profile Labels and Badge Assets',
    description:
      'Decode visual indicators attached to user accounts. Learn what different graphical markers signify regarding network roles, ENS ownership, and directory.',
  },
  '/help/keycard/keycard-functionality-by-platform': {
    title: 'The Keycard Hardware Wallet Functionality by Platform',
    description:
      'Review hardware wallet capabilities across iOS, Android, and desktop environments. Understand NFC limitations and USB smartcard reader protocol requests.',
  },
  '/help/keycard/if-you-can-t-unblock-your-keycard': {
    title: 'Troubleshoot Blocked Keycard Hardware Wallet Securely',
    description:
      'Troubleshoot failed PUK entries. Learn what happens when physical hardware wallets permanently lock to protect funds, and how to execute seed recoveries.',
  },
  '/help/messaging/add-remove-or-share-sticker-sets': {
    title: 'Add, Remove or Share Sticker Sets within Secure Chats',
    description:
      'Manage visual media libraries. Purchase new localized art packs, delete unused graphical assets, and send marketplace links to friends in encrypted chat.',
  },
  '/help/wallet/guide-to-dapp-interactions-in-status-wallet': {
    title: 'Guide to dApp Interactions in Status Web3 Crypto Wallet',
    description:
      'Master advanced Web3 browser mechanics safely. Review security protocols for signing complex message payloads and verifying external smart contract code.',
  },
  '/help/profile/set-up-and-customize-notification-exceptions': {
    title: 'Set Up & Customize Secure Chat Notification Exceptions',
    description:
      'Build complex alert filters tailored to daily workflows. Ensure critical pings from primary administrators break through global mobile application mutes.',
  },
  '/help/communities/delegate-management-functions-to-your-community': {
    title: 'Delegate Management Functions in Status Web3 Community',
    description:
      'Distribute administrative labor using decentralized logic. Mint specific governance tokens to trusted deputies to moderate chats and enforce smart rules.',
  },
  '/help/profile': {
    title: 'Profile Setup Guide: Your Sovereign Identity Status App',
    description:
      'Customize your public display name and identicon ring. Control local storage permissions and adjust global privacy settings for decentralized networking.',
  },
  '/help/messaging/customize-a-group-chat': {
    title: 'Customize Private Group Chats in Status P2P Chat App',
    description:
      'Modify the visual identity of a multi-user conversation. Change the room avatar and update the main chat title visible to all current room participants.',
  },
  '/help/communities/close-your-status-community': {
    title: 'Close Your Web3 Chat Community: Decommission App Nodes',
    description:
      'Disband a decentralized group entirely. Stop your local client from hosting the communication relay and remove the listing from public view directories.',
  },
  '/help/communities/set-up-a-view-only-channel': {
    title: 'Set Up a View-Only Channel in Your Web3 Chat Community',
    description:
      'Configure strict broadcasting permissions for a specific topic room. Restrict standard members from posting text, limiting communication to admins only.',
  },
  '/help/profile/change-your-status-password': {
    title: 'Change Your Local Password for the P2P Chat App Client',
    description:
      'Update the alphanumeric string securing your application interface. Maintain security hygiene by cycling the local encryption key guarding your profile.',
  },
  '/help/wallet/understand-block-explorers': {
    title: 'Understand Block Explorers: Verify Web3 Wallet Crypto',
    description:
      'Learn how to read public ledger information externally. Use trusted third-party websites to confirm whether your wallet transactions successfully mined.',
  },
  '/help/communities/create-a-channel': {
    title: 'Create a Channel Within Status Private Messaging App',
    description:
      'Deploy specific topic rooms to organize ongoing conversations. Set custom entry parameters and assign admin controls for your secure decentralized chat.',
  },
  '/help/wallet/set-network-fees-and-nonce': {
    title: 'Set Network Fees and Nonce for Web3 Wallet Transfers',
    description:
      'Manually override default gas estimates to accelerate pending transactions. Understand how adjusting the mathematical nonce fixes stuck wallet payloads.',
  },
  '/help/getting-started/prioritising-user-privacy-in-status-software': {
    title: 'Prioritising User Privacy in Status Software Systems',
    description:
      'Review core engineering ethos guiding code development. Central servers and data harvesting are rejected to prioritize cryptographic autonomy protocols.',
  },
  '/help/keycard/create-a-status-wallet-account-using-a-keycard': {
    title: 'Create Status Wallet Accounts Using Keycard Hardware',
    description:
      'Generate highly secure digital finance profiles. Link initial public receiving addresses directly to hardware signatures to protect mobile app memories.',
  },
  '/help/profile/log-out-of-status': {
    title: 'How to Safely Log Out of Your Secure Messenger App',
    description:
      'Clear your active session from local device memory. Review steps to secure your node before exit, requiring a password or biometrics for the next login.',
  },
  '/help/keycard/keycard-your-quick-start-guide': {
    title: 'Keycard Quick Start Guide: Setup Contactless Wallet',
    description:
      'Initialize new contactless hardware wallets. Follow basic instructions to establish secure PINs, write down PUKs, and link cards to mobile applications.',
  },
  '/help/profile/reset-your-notification-settings': {
    title: 'Reset Notification Settings in the Web3 Chat Client',
    description:
      'Revert custom sound and vibration profiles back to factory defaults. Clear complex rule sets quickly to establish clean baselines for app interruptions.',
  },
  '/help/communities/permissions-by-role-in-status-communities': {
    title: 'Permissions by Role in Status Web3 Chat Communities',
    description:
      'Review hierarchical power structures of decentralized groups. Understand exact capabilities granted to Owners, TokenMasters, and standard network users.',
  },
  '/help/communities/join-a-channel': {
    title: 'How to Join a Specific Channel in Status Web3 Chat',
    description:
      'Navigate token-gated or public topic rooms. Review entry requirements and learn how to participate in secure discussions hosted by other software users.',
  },
  '/help/profile/view-your-profile-as-someone-else': {
    title: 'View Public Profiles as Someone Else in Status App',
    description:
      'Preview public-facing identities from an external perspective. Verify exactly what information, bios, and network labels other decentralized users view.',
  },
  '/help/communities/set-up-your-community-join-requests': {
    title: 'Set Up Community Join Requests in Web3 Chat Groups',
    description:
      'Enable manual screening processes for decentralized groups. Review applicant profiles before granting access to internal channels and network histories.',
  },
  '/help/communities/vote-to-make-a-community-private-or-public': {
    title: 'Vote to Make a Community Private or Public in Web3',
    description:
      'Execute governance transitions via decentralized consensus. Learn the process for utilizing community tokens to alter smart contract directory indexing.',
  },
  '/help/wallet/understand-your-status-wallet-accounts-and-keys': {
    title: 'Understand Status Wallet Accounts and Cryptography',
    description:
      'Master self-custody cryptographic fundamentals safely. Trace mathematical journeys from randomized master seeds through specific pathways to signatures.',
  },
  '/help/getting-started/create-a-status-profile-using-a-recovery-phrase': {
    title: 'Create Status Profiles Using Web3 Recovery Phrases',
    description:
      'Restore complete decentralized identities. Input exact twelve-word master sequences to rebuild cryptographic keypairs and regain access to crypto funds.',
  },
  '/help/wallet/how-to-use-wallet-your-quick-start-guide': {
    title: 'How to Use the Status Web3 Wallet: Quick Start App',
    description:
      'Master decentralized finance fundamentals efficiently. Follow core tutorials covering critical safety protocols, asset receiving formats, and transfers.',
  },
  '/help/keycard/view-the-profile-or-wallet-accounts-on-your-keycard': {
    title: 'View Profile or Wallet Accounts on Keycard Devices',
    description:
      'Audit exact cryptographic data housed on physical hardware securely. Scan smartcards via NFC to confirm which master seeds and paths are stored locally.',
  },
  '/help/profile/customize-mentions-and-other-messages-notifications': {
    title: 'Customize Mentions and Other Message Notifications',
    description:
      'Fine-tune localized alerting parameters safely. Ensure critical direct peer-to-peer pings penetrate standard silent modes while preventing general spam.',
  },
  '/help/keycard/create-a-keycard-puk': {
    title: 'Create a Personal Unblocking Set Key for Your Keycard',
    description:
      'Generate a backup alphanumeric code during initial hardware setup. Securely store this master password to recover access if your daily PIN is forgotten.',
  },
  '/help/wallet/receive-crypto': {
    title: 'Receive Crypto Safely in Status Non-Custodial Wallet',
    description:
      'Generate public addresses or QR codes to accept incoming digital assets. Provide the correct chain information to avoid losing your decentralized funds.',
  },
  '/help/wallet/understand-erc20-tokens': {
    title: 'Guide to ERC-20 Tokens in Status Multi-Chain Wallet',
    description:
      'Learn how Ethereum-based standard assets function within self-custody accounts. Identify supported token types and review custom network contract logic.',
  },
  '/help/profile/remove-a-contact-from-status': {
    title: 'Remove Contacts From Status Secure Private Messenger',
    description:
      'Delete saved public keys from localized address books. Ensure chatkeys are discarded while understanding peer-to-peer history may remain intact locally.',
  },
  '/help/communities/recover-your-status-community': {
    title: 'Recover Web3 Communities on the Decentralized Messenger',
    description:
      'Restore administrative access to decentralized groups. Use original wallet seed phrases to re-authenticate ownership of underlying smart contract logic.',
  },
  '/help/communities/configure-channel-permissions': {
    title: 'Configure Channel Permissions in Web3 Communities App',
    description:
      'Establish granular control over group communications. Assign specific administrative capabilities like pinning messages or kicking members to key roles.',
  },
  '/help/wallet/share-your-status-wallet-address': {
    title: 'Share Your Secure Web3 Status Wallet Addresses Offline',
    description:
      'Distribute public hexadecimal keys to receive incoming digital assets. Generate localized QR codes or copy exact text strings to prevent routing errors.',
  },
  '/help/profile/sync-your-profile-across-devices': {
    title: 'Sync Profiles Across Devices on Status Messenger App',
    description:
      'Maintain identical chat histories and contact lists on desktop and mobile. Securely pair node databases over local networks without any central servers.',
  },
  '/help/wallet/send-crypto-to-your-status-wallet': {
    title: 'Transfer Crypto Easily to Multi-Chain Status Wallet',
    description:
      'Fund self-custody accounts from external exchanges. Match network chains and verify receiving addresses to ensure incoming digital assets arrive safely.',
  },
  '/help/wallet/organize-funds-and-accounts-with-a-new-master-key': {
    title: 'Organize Funds & Accounts With a Private New Master Key',
    description:
      'Generate fresh cryptographic seeds to compartmentalize financial risk securely. Separate daily spending addresses from deep cold storage vaults offline.',
  },
  '/help/messaging/pin-a-message': {
    title: 'How to Pin Message in Your Encrypted Messaging App',
    description:
      'Highlight important text inside individual or group conversations. Ensure participants quickly see critical updates or links at the top of chat screens.',
  },
  '/help/wallet/understand-l2s-and-sidechains': {
    title: 'Guide to L2s and Sidechains for Status Multi-Chain Apps',
    description:
      'Learn how external scaling solutions reduce transaction costs. Compare security trade-offs of optimistic rollups versus independent blockchain networks.',
  },
  '/help/communities/mint-tokens-for-your-community': {
    title: 'Mint Custom Tokens for Status Decentralized Communities',
    description:
      'Deploy unique economic assets for decentralized groups. Generate fresh ERC-20 supply to incentivize active members or gate access to premium chat rooms.',
  },
  '/help/communities/set-up-a-token-gated-community': {
    title: 'Set Up Token-Gated Communities in Status Web3 Chat App',
    description:
      'Restrict global group entry using smart contracts. Require prospective members to hold an exact balance of specific digital assets to read main lobbies.',
  },
  '/help/profile/if-you-lose-your-status-password-or-recovery-phrase': {
    title: 'Guide on Lost Status Passwords or Recovery Phrases',
    description:
      'Execute absolute last-resort recovery actions. Understand the immutable nature of decentralized software and what assets remain accessible if keys burn.',
  },
  '/help/profile/respond-to-a-contact-request': {
    title: 'Respond to Contact Requests in Status P2P Chat App',
    description:
      'Review incoming peer connections safely. Approve or deny users attempting to establish encrypted one-on-one communication channels with public profiles.',
  },
  '/help/profile/delete-your-status-profile': {
    title: 'Delete Your Local Profile on Private Messaging App',
    description:
      'Permanently erase your identity database from the current hardware. Ensure you understand that without a written recovery phrase, you will lose access.',
  },
  '/help/wallet/swap-crypto-in-status-wallet': {
    title: 'Swap Crypto Directly Inside Multi-Chain Wallet App',
    description:
      'Exchange different digital assets without relying on centralized exchanges. Route trades through decentralized liquidity pools directly inside the app.',
  },
  '/help/communities/create-a-status-community': {
    title: 'Create a Web3 Chat Community in Status Messenger App',
    description:
      'Deploy the foundational smart contracts for a new decentralized social space. Establish initial ownership keys and define the public directory listing.',
  },
  '/help/messaging/format-your-messages': {
    title: 'Format Your Messages in Status Encrypted Messaging App',
    description:
      'Apply bold, italic, or strikethrough styling to your encrypted texts. Use markdown syntax to organize long paragraphs and emphasize important keywords.',
  },
  '/help/wallet/understand-wrapped-tokens': {
    title: 'Understand Wrapped Tokens in Status Multi-Chain Wallet',
    description:
      'Learn why native assets like Bitcoin are mirrored on the Ethereum network. Review the smart contracts required to utilize cross-chain liquidity safely.',
  },
  '/help/communities/find-communities-to-join': {
    title: 'Find Web3 Communities to Join via Status P2P Chat App',
    description:
      'Browse the public curation directory to find active decentralized groups. Search by topic or analyze token-weighted rankings to find valuable networks.',
  },
  '/help/messaging/edit-and-delete-messages': {
    title: 'Edit and Delete Sent Messages in Status P2P Chat App',
    description:
      'Correct typos or retract statements locally. Understand how network propagation limits the guarantee that older messages are removed from peer devices.',
  },
  '/help/communities/burn-your-community-tokens': {
    title: 'Burn Community Tokens to Manage Decentralized Supplies',
    description:
      "Permanently destroy minted administrative assets via a smart contract. Reduce your community's circulating supply to adjust governance dynamics safely.",
  },
  '/help/communities/invite-people-to-a-channel': {
    title: 'Invite Users Directly to a Web3 Chat Community Channel',
    description:
      'Generate localized deep links to route new participants into specific discussion rooms. Bypass the main lobby to grow targeted internal project groups.',
  },
  '/help/messaging/understand-group-chats': {
    title: 'Understand Group Chats in Status Private Messaging App',
    description:
      'Learn how multi-party conversations handle key exchanges without central servers. Review limitations on participant counts and history synchronization.',
  },
  '/help/profile/create-and-use-additional-status-profiles': {
    title: 'Create and Use Additional Status Profiles for Privacy',
    description:
      'Generate isolated cryptographic identities on single devices. Maintain strict separation between public professional personas and anonymous financials.',
  },
  '/help/profile/customize-direct-message-notifications': {
    title: 'Customize Direct Message Notifications in Status App',
    description:
      'Assign distinct visual and audio alerts to specific one-on-one conversations. Ensure high priority peer communications bypass standard filtering rules.',
  },
  '/help/communities/understand-token-revocation-consequences': {
    title: 'Understand Token Revocation Consequences in Web3 Hub',
    description:
      'Review systemic impacts of burning administrative assets. Learn how demoting community leaders affects channel access and historical message retrieval.',
  },
  '/help/profile/faq-status-keys-and-recovery-phrase': {
    title: 'FAQ on Cryptographic Keys and Web3 Recovery Phrases',
    description:
      'Review critical answers regarding cryptographic self-custody. Understand the mathematical relationships between twelve word seeds and network chatkeys.',
  },
  '/help/keycard/create-a-status-profile-using-keycard': {
    title: 'Create Status Profiles Using Keycard Wallet Devices',
    description:
      'Initialize decentralized identities directly onto physical hardware. Generate keys offline to ensure master seeds never touch any internet connections.',
  },
  '/help/communities/change-a-token-gated-community-to-open': {
    title: 'Change Token Gated Communities to Open Access Nodes',
    description:
      'Remove overarching smart contract entry requirements. Transition decentralized groups from exclusive asset-backed clubs into public directory listings.',
  },
  '/help/communities/import-a-discord-community-into-status': {
    title: 'Import Discord Communities into the Web3 Status App',
    description:
      'Migrate traditional user bases to decentralized platforms. Learn best practices for structuring channels, establishing token gates, and adding members.',
  },
  '/help/wallet/administer-your-wallet-dapp-connections': {
    title: 'Administer Web3 Wallet dApp Connections Confidently',
    description:
      'Review active smart contract authorizations. Revoke outdated permissions and disconnect external websites to prevent malicious actors draining wallets.',
  },
  '/help/wallet/import-an-account-into-your-status-wallet': {
    title: 'Import Accounts Into Status Multi-Chain Wallet Apps',
    description:
      'Restore existing cryptocurrency balances from external applications. Enter specific private key strings to integrate isolated addresses safely offline.',
  },
  '/help/communities/import-a-community-someone-shares-with-you': {
    title: 'Import Web3 Communities Shared via Direct App Links',
    description:
      'Connect to decentralized groups via manual direct routing. Enter specific peer-to-peer node keys to access highly restricted or unlisted social spaces.',
  },
  '/help/communities/token-based-access-to-communities-and-channels': {
    title: 'Token Based Access to Web3 Communities and Channels',
    description:
      'Design exclusive digital economies securely. Understand how to map specific ERC-20 balances to precise discussion rooms to create tiered access layers.',
  },
  '/help/wallet': {
    title: 'Help Center: Configure Your Multi-Chain Wallet App',
    description:
      'Learn to secure your digital assets properly. Follow basic tutorials to generate private keys and manage your decentralized finance portfolio securely.',
  },
  '/help/wallet/understand-common-scams': {
    title: 'Identify Crypto Scams in Non-Custodial Wallet Apps',
    description:
      'Identify malicious behavior in the decentralized web. Learn to protect recovery phrases from social engineering and avoid bad smart contract approvals.',
  },
  '/help/profile/block-or-unblock-someone-in-status': {
    title: 'Block or Unblock Contacts in Private Messaging App',
    description:
      'Manage local network firewalls safely. Prevent specific cryptographic identities from sending direct messages and learn how to restore access later on.',
  },
  '/help/keycard/connect-your-keycard-to-your-device': {
    title: 'Connect Keycard Hardware Wallets to Mobile Devices',
    description:
      'Establish initial NFC links between physical hardware and mobile apps. Learn correct physical placement for seamless cryptographic phone communication.',
  },
  '/help/communities/transfer-your-community-s-ownership': {
    title: 'Transfer Community Ownership in Web3 Chat Networks',
    description:
      'Hand over administrative control of decentralized groups safely. Execute smart contract functions to assign the master role to new wallet keys forever.',
  },
  '/help/communities/how-to-airdrop-the-tokenmaster-token': {
    title: 'How to Airdrop TokenMaster Tokens in Web3 Chat App',
    description:
      'Distribute high-level administrative capabilities automatically. Send specific governance assets to trusted deputies to mint group currencies securely.',
  },
  '/help/communities/revoke-a-community-token-from-someone': {
    title: 'Revoke Community Tokens From Members in Status App',
    description:
      'Confiscate administrative assets using smart contract overrides. Remove disruptive user capabilities by burning utility tokens directly on blockchains.',
  },
  '/help/communities/blockchain-networks-comparison-for-airdrops': {
    title: 'Blockchain Network Comparisons for Crypto Airdrops',
    description:
      'Select optimal ecosystems for mass token distribution. Analyze historical gas fee averages and network congestion metrics across Mainnet and L2 chains.',
  },
  '/help/keycard/rename-your-keycard': {
    title: 'Rename Your Keycard for the Secure Crypto Wallet App',
    description:
      'Assign a custom local identifier to your physical hardware wallet. Easily differentiate between multiple smartcards connected to your secure Web3 apps.',
  },
  '/help/getting-started/check-your-status-app-version': {
    title: 'Check Current Status App Ver for Secure & Private Chat',
    description:
      'Verify software releases are fully updated. Ensure local clients contain the newest cryptographic patches and core node architectural improvements now.',
  },
  '/help/profile/view-notifications-and-updates': {
    title: 'View Notifications in Status Secure Messenger Client',
    description:
      'Navigate centralized alert centers directly. Review missed direct messages, pending contact requests, and critical software upgrade alerts in one feed.',
  },
  '/help/communities/about-losing-access-to-a-community': {
    title: 'Understand Lost Access to Token Gated Web3 Communities',
    description:
      'Review why group entry was revoked. Common causes include token balance drops, manual administrator bans, and underlying node synchronization failures.',
  },
  '/help/communities/about-the-community-history-service': {
    title: 'About the Community History Service for P2P Messaging',
    description:
      'Understand decentralized data retention models. Learn how control nodes aggregate and distribute past message payloads so newly added members can read.',
  },
  '/help/getting-started/about-the-ethereum-blockchain': {
    title: 'About the Ethereum Blockchain for Web3 Status App Users',
    description:
      'Understand the decentralized ledger powering financial tools. Learn how independent nodes reach consensus to secure networks without any central banks.',
  },
  '/help/communities/about-losing-access-to-a-channel': {
    title: 'About Losing Access to Token Gated Status Web3 Channels',
    description:
      'Understand why members face removal from specific rooms. Review the automated enforcement of smart contract token-gating and manual kicking procedures.',
  },
  '/help/wallet/if-someone-else-has-access-to-your-wallet': {
    title: 'What to Do if Someone Accesses Private Crypto Wallets',
    description:
      'Execute emergency procedures if recovery phrases get compromised. Learn how to route remaining assets to new smart contracts before funds are drained.',
  },
  '/help/messaging/change-who-can-invite-you-to-group-chats': {
    title: 'Change Who Can Invite Users to Group Chats in Status',
    description:
      'Restrict unsolicited multi-user conversation additions. Prevent spam by requiring users to be saved in verified contact lists before pushing payloads.',
  },
  '/help/messaging/messages-faq': {
    title: 'Messaging FAQ for Top Telegram Alternatives Privacy',
    description:
      'Resolve common peer-to-peer delivery issues. Understand how Waku protocols route your text data and why some notifications may be temporarily delayed.',
  },
  '/help/communities/replace-your-community-s-control-node': {
    title: 'Replace Community Control Nodes in Status Chat Apps',
    description:
      'Migrate decentralized group core servers to new hardware. Update public directory pointers to ensure members seamlessly connect to the message relays.',
  },
  '/help/communities/mint-the-owner-and-tokenmaster-tokens': {
    title: 'Mint Owner and TokenMaster Tokens for Web3 Chatting',
    description:
      'Generate foundational governance assets during initial group setups. Secure highly privileged smart contract tokens to maintain administrative powers.',
  },
  '/help/communities/turn-off-the-community-history-service': {
    title: 'Turn Off the Community History Service in Web3 Chat',
    description:
      'Disable persistent decentralized chat logs. Conserve local hardware bandwidth and enforce strict ephemeral messaging by stopping node archive syncing.',
  },
  '/help/profile/enable-ethereum-testnet-mode-in-status': {
    title: 'Enable Ethereum Testnet Mode in Private Web3 Wallet',
    description:
      'Access experimental blockchain networks safely. Isolate development environments to practice executing smart contracts using worthless testing assets.',
  },
  '/help/communities/revoke-the-tokenmaster-role-from-someone': {
    title: 'Revoke TokenMaster Roles From Someone in Web3 Chats',
    description:
      'Demote high-level administrators safely. Burn specific governance assets via smart contracts to permanently remove their ability to alter group rules.',
  },
  '/help/wallet/about-tokens-collectibles-and-ens-names': {
    title: 'About Tokens, Collectibles, and ENS Names in Wallet',
    description:
      'Understand specific digital asset classes supported by decentralized applications. Differentiate between fungible currency, NFTs, and network routing.',
  },
  '/help/messaging/clear-the-chat-history': {
    title: 'Clear Chat History on Your Decentralized Messenger',
    description:
      'Remove past text and media payloads from your personal storage drive. Protect physical device privacy by routinely purging old peer-to-peer data logs.',
  },
  '/help/wallet/about-exporting-your-recovery-phrase': {
    title: 'About Exporting Recovery Phrases From Web3 Wallets',
    description:
      'Review strict security protocols before viewing twelve master words. Understand why taking digital screenshots risks total loss of financial accounts.',
  },
  '/help/communities/change-a-token-gated-channel-to-open': {
    title: 'Change Token Gated Channels to Open Access in Apps',
    description:
      'Remove smart contract entry restrictions from specific community rooms. Allow all general members to read and broadcast messages without asset gating.',
  },
  '/help/getting-started/run-the-status-app-for-the-first-time': {
    title: 'Run the Status Secure Messenger for the First Time',
    description:
      'Navigate initial software boot sequences. Configure core security parameters, agree to decentralized operating terms, and generate network identities.',
  },
  '/help/profile/back-up-and-secure-your-recovery-phrase': {
    title: 'Back Up and Secure Status Recovery Phrases Offline',
    description:
      'Protect the master key to entire digital identities. Review critical techniques for offline physical storage to ensure cryptographic accounts survive.',
  },
  '/help/wallet/about-your-status-wallet-accounts-and-addresses': {
    title: 'About Status Web3 Wallet Accounts and Address Data',
    description:
      'Understand cryptographic derivation logic clearly. Learn how one master seed phrase generates infinite unique public addresses across multiple chains.',
  },
  '/help/profile/configure-rich-link-previews-in-messages': {
    title: 'Configure Rich Link Previews in Private Messengers',
    description:
      'Control local data fetching protocols. Prevent devices from pinging external servers to load website images, ensuring maximum metadata privacy safely.',
  },
  '/help/wallet/about-decentralized-apps-in-status-wallet': {
    title: 'About Decentralized Apps in the Secure Web3 Wallet',
    description:
      'Navigate the integrated Web3 browser environment securely. Learn to interact with external smart contracts and decentralized exchanges inside the app.',
  },
  '/help/keycard/unblock-your-keycard': {
    title: 'Unblock a Locked Keycard for Your Non-Custodial Wallet',
    description:
      'Restore access to your physical hardware wallet after too many failed PIN attempts. Follow steps to authenticate and reset local security credentials.',
  },
  '/help/profile/customize-group-chat-notifications': {
    title: 'Customize Your Group Chat Notifications in Status App',
    description:
      'Filter high-volume multi-user discussions. Set specific alerts for direct mentions only, muting background chatter while ensuring critical peer pings.',
  },
  '/help/communities/organize-channels-using-categories': {
    title: 'Organize Your Channels Using Web3 Community Categories',
    description:
      'Structure large decentralized groups effectively. Group related topic rooms under collapsible visual headers to improve navigation for active members.',
  },
  '/help/communities/invite-people-to-a-status-community': {
    title: 'Invite People to Join Status Web3 Communities Securely',
    description:
      'Generate global deep links to expand decentralized user bases. Share custom routing URLs externally to funnel new members directly into group lobbies.',
  },
  '/help/wallet/connect-to-dapps-using-walletconnect': {
    title: 'Connect to dApps Using WalletConnect Status Connector',
    description:
      'Bridge secure mobile assets to external desktop websites. Scan QR codes to authorize remote smart contract interactions without exposing private keys.',
  },
  '/help/profile/mute-your-notifications': {
    title: 'Mute Profile Notifications on Status Private Messaging',
    description:
      'Temporarily silence incoming notifications from specific communities, channels, group chats or direct message. Regain control over your digital focus.',
  },
  '/help/communities/understand-your-token-actions-in-status': {
    title: 'Understand Token Actions in Status Web3 Chat Groups',
    description:
      'Differentiate between automated smart contract executions and manual administrative commands. Learn how minting and burning directly affect blockchain.',
  },
  '/help/profile/about-changing-your-status-password': {
    title: 'About Changing Local Passwords on P2P Chat Clients',
    description:
      'Understand security implications of updating primary device locks. Review why losing primary code requires complete account recoveries via seed phrases.',
  },
  '/help/wallet/request-a-crypto-payment-from-someone': {
    title: 'Request Crypto Payments Inside the Ethereum Wallet',
    description:
      'Learn how to request a crypto payment through direct messages, group chats or community channels from contacts and non-contacts in Status Desktop App.',
  },
  '/help/wallet/status-wallet-your-quick-start-guide': {
    title: 'Status Web3 Wallet Quick Start Guide for New Users',
    description:
      'Learn how to initialize self-custody wallet. Learn the fundamentals of securing recovery phrases, copying public addresses, and receiving crypto funds.',
  },
  '/help/communities/set-up-a-token-gated-channel': {
    title: 'Set Up Token Gated Channels within Status Web3 Chat',
    description:
      'Restrict discussion room access via smart contract parameters. Require users to hold specific NFTs or ERC-20 balances to unlock exclusive chat accesses.',
  },
  '/help/profile/sign-in-to-your-status-profile-on-a-new-device': {
    title: 'Sign In to Secure Status Profiles on Your New Devices',
    description:
      'Migrate secure identities across new hardware safely. Input twelve-word recovery phrases to instantly restore contact lists and community token balances.',
  },
  '/help/messaging/send-direct-messages-to-your-contacts': {
    title: 'Send Direct Messages to Contacts in P2P Chat Clients',
    description:
      'Initiate direct encrypted peer-to-peer chat clients. Ensure perfect forward secrecy while routing text and media payloads to verified public network keys.',
  },
  '/help/messaging/enable-rich-link-previews-in-messages': {
    title: 'Enable Rich Link Previews in Encrypted Chat Clients',
    description:
      'Allow local clients to fetch website metadata automatically in App. Toggle this setting while understanding privacy trade-offs of pinging external servers.',
  },
  '/help/wallet/install-the-status-connector-extension': {
    title: 'Install the Status Connector Extension Web3 Browser',
    description:
      'Bridge Status desktop web browsing securely to mobile applications. Learn how to approve external smart contract interactions via local push notifications.',
  },
  '/help/wallet/connect-to-dapps-using-status-connector': {
    title: 'Connect to dApps Using Status Connector Web3 Wallet',
    description:
      'Link self-custody accounts to external websites securely. Authorize Web3 logins and sign blockchain transactions directly from the Status desktop browser.',
  },
  '/help/wallet/collectibles-your-quick-start-guide': {
    title: 'Collectibles Quick Start Guide for Ethereum Wallet',
    description:
      'Manage digital art and NFTs within self-custodial Status Wallet. Learn how to view visual assets, verify smart contracts, and transfer tokens securely.',
  },
  '/help/wallet/withdraw-crypto-to-your-bank-account': {
    title: 'Withdraw Crypto to Bank Accounts via Status Wallet',
    description:
      'Off-ramp digital assets into traditional financial systems safely. Use integrated Status fiat gateways to convert Ethereum balances into currency deposits.',
  },
  '/help/profile/if-your-status-password-doesn-t-work': {
    title: 'Troubleshoot Failed Passwords in Web3 Chat Clients',
    description:
      'Troubleshoot immediate login failures on physical devices. Ensure keyboard localization is correctly set before executing irreversible factory app resets.',
  },
  '/help/getting-started/how-to-use-status-your-quick-start-guide': {
    title: 'How to Use Status: Quick Start Guide for Web3 Apps',
    description:
      'Navigate core features of the unified Web3 App interface. Master sending encrypted texts, joining decentralized communities, and managing crypto tokens.',
  },
  '/help/messaging/add-people-to-a-direct-message': {
    title: 'Add People to Direct Messages in Web3 Chat Clients',
    description:
      'Convert Status one-on-one conversations into multi-user groups safely. Distribute new encryption keys dynamically while applying chat history limitations.',
  },
  '/help/wallet/lower-your-fees-with-layer-2-networks': {
    title: 'Lower Transfer Fees With Layer 2 Ethereum Networks',
    description:
      'Avoid high base gas costs by transacting on scalable sidechains. Learn how to bridge assets to Optimism or Arbitrum directly within Status crypto wallets.',
  },
  '/help/wallet/status-wallet-faq': {
    title: 'FAQ for the Status Non-Custodial Crypto Wallet App',
    description:
      'Troubleshoot failing transactions and network delays. Find clear answers regarding gas limits, custom token imports, and private key recoveries locally.',
  },
  '/help/messaging/leave-a-group-chat': {
    title: 'Leave Encrypted Group Chats in the P2P Chat Client',
    description:
      'Exit multi-user conversations safely. Remove active chats from local device interfaces and stop receiving pushed updates from other participating nodes.',
  },
  '/help/messaging/delete-a-group-chat': {
    title: 'Delete an Encrypted Group Chat on the Web3 Chat App',
    description:
      'Permanently remove multi-user conversations from local databases. Understand why this action cannot clear the history stored on other participant devices.',
  },
  '/help/getting-started/reset-the-status-app': {
    title: 'Reset the Private Messaging App to Factory Defaults',
    description:
      'Wipe all local account data from current device installations. Understand the permanent deletion of chat histories before attempting software recoveries.',
  },
  '/help/getting-started/find-people-on-status': {
    title: 'Find and Add Friends on the Decentralized Messenger',
    description:
      'Search for specific user profiles via unique chatkeys or ENS names. Initiate direct contact requests to start exchanging end-to-end encrypted messages.',
  },
  '/help/messaging/send-an-audio-message': {
    title: 'Send Voice Audio Messages in the Secure Messenger App',
    description:
      'Record and share vocal notes within encrypted one-on-one conversations. Learn interface workflows for using microphone features across all web3 clients.',
  },
  '/help/messaging/about-status-messages': {
    title: 'Peer-to-Peer Architecture for Secure Messaging Apps',
    description:
      'Understand how texts travel without central servers. Status uses localized node routing to ensure no corporate entity can intercept or read chat payloads.',
  },
  '/help/wallet/about-your-wallet-accounts-and-addresses': {
    title: 'About Crypto Wallet Accounts and Public Address Data',
    description:
      'Understand cryptographic derivation logic clearly. Learn how one master seed phrase generates infinite unique public addresses across multiple blockchains.',
  },
}

export function getSeoOverride(path: string): SeoOverride | undefined {
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '')
  return SEO_OVERRIDES[normalized]
}
