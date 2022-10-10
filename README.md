# Status Web 🌐

[![CI](https://github.com/status-im/status-web/actions/workflows/ci.yml/badge.svg)](https://github.com/status-im/status-web/actions/workflows/ci.yml)

## About

Embeddable, customizible and themable component for your Community.

## Usage

### For Community owners 👥

**Get public key to your pre-existing Community:**

Status Desktop > select Community > click on its overview in upper left corner > Invite new people > Share community > copy link > get only the public key (e.g. `0x033c88c950480493e2e759923bd38f9aad88e1b36295757a598679a569e6a96801`)

**Or create new one first:**

Get Status Desktop at <https://status.im/get> > Chat > click on plus icon > Communities

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

For example, <https://status-devcon.vercel.app/>.

If the Community doesn't require a joining request, that would be it. So look around and get the feel for the space.

**Once ready to chat, create a throwaway profile:**

Use Throwaway Profile > wait for your request to be approved and the chat input enabled > react to and write messages

**Optionally, you could even run the application locally yourself.**

Get the source ready:

```sh
git clone https://github.com/status-im/status-web.git
cd ./status-web
npm install
npm build
```

Add your Community's public key to your environment:

```sh
echo 'PUBLIC_KEY="0x033c88c950480493e2e759923bd38f9aad88e1b36295757a598679a569e6a96801"' >> examples/with-vite/.env
```

And run it:

```sh
npm run test --workspace=examples/with-vite
```
