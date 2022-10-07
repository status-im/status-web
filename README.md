# Status Web

[![CI](https://github.com/status-im/status-web/actions/workflows/ci.yml/badge.svg)](https://github.com/status-im/status-web/actions/workflows/ci.yml)

## Release

- Alpha

## Installation

- TBD

## Features

- [ ] Communities
  - [ ] ~~Management~~
  - [ ] Settings
    - [ ] Notifications
  - [ ] Channels/Chats
    - [x] Categories
    - [ ] Muting
    - [ ] Token gating
  - [ ] Messages
    - [x] History
    - [ ] Search
    - [ ] Text formatting
      - [ ] Bold
      - [ ] Italic
      - [ ] Strikethrough
      - [ ] Code
    - [ ] Type
      - [x] Plain text
      - [x] Replies
      - [ ] Mentions
      - [ ] Pins
      - [ ] Links
      - [ ] Images
      - [ ] Stickers
      - [ ] GIFs
      - [ ] Audio
      - [ ] Emojis
    - [ ] State
      - [x] Edited
      - [ ] Pending
      - [ ] Failed
      - [ ] Sent
      - [ ] Read
      - [ ] Delivered
      - [ ] Deleted
  - [ ] Account
    - [ ] Type
      - [x] Throwaway
      - [ ] Ethereum wallet
      - [ ] Mobile/Desktop sync
    - [ ] Properties
      - [x] Color hash
      - [ ] Emoji hash
      - [ ] ENS names
      - [ ] Display name
      - [x] Chat key cutoffs
    - [ ] Contact card
    - [ ] Online, offline status
    - [ ] Collectibles
    - [ ] Tokens
    - [ ] Network preference
  - [ ] Avatars
    - [x] Initials
    - [x] Colors
    - [ ] Pictures
  - [ ] Notifications/Activity Center
    - [ ] Category
      - [ ] Unreads
      - [x] Mentions
      - [x] Replies
      - [ ] Identity verifications
      - [ ] Membership/joining requests
      - [ ] Contact requests
      - [ ] Profile creations
    - [ ] Subcategory
      - [ ] Read
      - [ ] Unread
      - [ ] Hidden
    - [ ] Type
      - [x] Count
      - [x] List
      - [ ] Banner
      - [ ] Toast messages
  - [ ] Members
    - [x] List
    - [ ] Online, offline status
  - [ ] Contacts
    - [ ] State
      - [ ] Verified
      - [ ] Untrustworthy
      - [ ] Mutual
  - [ ] Encryption
- [ ] Direct messages/Messages
  - [ ] Group chats
  - [ ] 1:1
- [ ] Theming
  - [x] Light
  - [ ] Dark
  - [ ] Custom
- [ ] Browser extension
- [ ] Network
  - [ ] Status
  - [ ] Mode
- [ ] ~~Wallet (in-app)~~
- [ ] ~~Browser~~

## Known Issues

- UI
  - Visiting root page does not land on first chat in order
  - Centering of avatar contents
  - Unsupported mind and narrow breakpoints
  - Chat body overflows on a message with long text with no whitespace (truncating)
  - Refreshing Activity Center after fetching new history or after eventual login
  - Canceling input edit on ESC
  - Saving input edit on ENTER
  - Disabled input prior joining with "You need to join this community to send messages" placeholder
  - community demanding request to join?
  - Missing Community' welcome dialog/code of conduct
  - Missing create throwaway profile multi-step dialog
- Protocol
  - Clock validation on Community initialization
  - Disconnects

## Docs

- User
  - <https://help.status.im/en/>
