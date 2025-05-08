# Status Wallet (Trust Wallet)

## Contribute

Clone public repository:

```bash
git clone https://github.com/status-im/status-web.git
```

Add private remote:

```bash
git remote add private https://github.com/status-im/status-web-private.git
```

Pull from private remote:

```bash
git fetch private
```

Push to private remote:

```bash
git push private [local branch]:[remote branch]
```

## Compatibility

Tested with these browsers:

- Google Chrome

## Development

### Google Chrome

#### Develop

```bash
pnpm dev:chrome
```

#### Build

```bash
pnpm build:chrome
```

#### Load

Google Chrome > Window > Extensions > enable Developer mode

Google Chrome > Window > Extensions > Load unpacked > select build (.output/chrome-mv3)

> Note: Reloads automatically in development.

#### Visit

Google Chrome > Extensions > A wallet by Status > Inspect views > service worker

Google Chrome > Toolbar > Extensions > Status Wallet

Google Chrome > Toolbar > Extensions > Status Wallet > Open side panel

chrome-extension://\[ID]/page.html
