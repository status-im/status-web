# A wallet extension by Status

## Compatibility

Tested with these browsers:

- Google Chrome

## Development

### Env

Set environment variables in:

- [`apps/api/.env`](../api/.env)
- [`packages/wallet/.env`](../../packages/wallet/.env)

### Google Chrome

#### Develop

Follow [Getting Started](../../README.md#getting-started)

#### Load

Google Chrome > Window > Extensions > enable Developer mode

Google Chrome > Window > Extensions > Load unpacked > select build (.output/chrome-mv3)

> Note: Reloads automatically in development.

> Note: Press Command + Shift + . to show hidden files like `.output/`.

#### Visit

Google Chrome > Extensions > Status Portfolio Wallet (Beta) > Inspect views > service worker

Google Chrome > Toolbar > Extensions > Status Portfolio Wallet (Beta)

Google Chrome > Toolbar > Extensions > Status Portfolio Wallet (Beta) > Open side panel

chrome-extension://\[ID]/page.html#/portfolio

chrome-extension://\[ID]/page.html#/onboarding
