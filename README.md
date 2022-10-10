# Status Web 🌐

[![CI](https://github.com/status-im/status-web/actions/workflows/ci.yml/badge.svg)](https://github.com/status-im/status-web/actions/workflows/ci.yml)

## Run

### For Community owners 👥

**Get public key to your pre-existing Community:**

Status Desktop > select Community > click on its overview in upper left corner > Invite new people > Share community > copy link > get only the public key (e.g. `0x033c88c950480493e2e759923bd38f9aad88e1b36295757a598679a569e6a96801`)

[insert screenshot]

**Or create new one first:**

Get Status Desktop at <https://status.im/get/> > Communities Portal > Create New Community

[insert screenshot]

**Embed the Community to pre-existing page:**

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
  environment="production"
  theme="light"
/>
```

For an example, see ``.

**Or have it as stand-alone site:**

For an example, see ``.

**To deploy it for free, you could use Vercel:**

Create account > ...

Other examples with different bundling and deployment flows could be found under `` as well.

### For User 👤

**Simply visit your Community's url from the browser:**

For example, <https://status-devcon.vercel.app/>.

[insert screenshots]

If the Community doesn't require a joining request, that would be it. So look around and get the feel for the space.

**Once ready to chat, create a throwaway profile:**

Use Throwaway Profile > wait for your request to be approved and the chat input enabled > react to and write messages

**Optionally, you could even run the application locally yourself.**

Get the source ready:

```sh
git clone
cd
npm build
```

And run it in the background:

```sh
npm workspaces start &
```
