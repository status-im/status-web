# Status Web 🌐

[![CI](https://github.com/status-im/status-web/actions/workflows/ci.yml/badge.svg)](https://github.com/status-im/status-web/actions/workflows/ci.yml)

## About

Embeddable, customizable and themable component for your Status Community.

### Who

- For community leaders
- online content creators
- and their followers

### What

- It is 100% open source
- 100% decentralized
- Peer-to-peer
- Private
- Pseudoanonymous
- End-to-end encrypted
- Free
- Permissionless
- Serverless
- Group chat platform
- And a virtual space outside the jurisdiction of any government

### Why

- To communicate and collaborate freely without worrying about
  - Censorship
  - Persecution
  - Chilling effects
  - Interference
  - Oppression
  - Being deplatformed, or shut down
- Support
  - Autonomy
  - Free speech
  - Freedom of association
  - Freedom to transact
  - Right to privacy
  - Crypto native and frictionless integration
  - Monetization
  - Facilitation of sharing of common interests, needs, desires and values
- Be trusted alternative to centralized group chat application

## Usage

### For Community owners 👥

**Get public key to your pre-existing Community:**

1. Open Status Desktop
2. Select Community
3. Click on its overview in upper left corner
4. Invite new people
5. Share community
6. Get only the public key from the URL (e.g. `0x033c88c950480493e2e759923bd38f9aad88e1b36295757a598679a569e6a96801`)

**Or create new one first:**

1. Get Status Desktop at <https://status.im/get>
2. Go to Chat
3. Click on plus icon
4. Click on Communities

**Use the Community component:**

In your project,

Install package:

```sh
npm install @status-im/react
```

Import component:

```js
import { Community } from '@status-im/react'
```

Set component props:

```js
<Community
  publicKey="0x033c88c950480493e2e759923bd38f9aad88e1b36295757a598679a569e6a96801"
  theme="light"
/>
```

For an example, see [examples/with-vite/src/app.tsx](./examples/with-vite/src/app.tsx).

### For User 👤

**Simply visit your Community's URL from the browser:**

If the Community doesn't require a joining request, that would be it. So look around and get the feel for the space.

**Once ready to chat, create a throwaway profile:**

Use Throwaway Profile > wait for your request to be approved and the chat input enabled > react to and write messages

**Optionally, you could even run the application locally yourself.**

Get the source ready:

```sh
git clone https://github.com/status-im/status-web.git
cd ./status-web
yarn install
yarn run build
```

Add your Community's public key to your environment:

```sh
echo 'PUBLIC_KEY="0x033c88c950480493e2e759923bd38f9aad88e1b36295757a598679a569e6a96801"' >> examples/with-vite/.env
```

And run it:

```sh
yarn workspace with-vite run dev
```
