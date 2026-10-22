# connector

A wallet connector by Status: it hands the Status Desktop Wallet to decentralised applications in
your browser. Built with Plasmo, so one codebase covers Chrome, Safari and Firefox.

## Run

```bash
pnpm --filter connector dev           # Chrome, alias of dev:chrome
pnpm --filter connector dev:safari
pnpm --filter connector dev:firefox

pnpm --filter connector build          # Chrome, to build/chrome-mv3-prod
pnpm --filter connector build:firefox  # Firefox, also zips the build
```

Load the unpacked Chrome build from `build/chrome-mv3-dev`.

The connector needs [Status Desktop](https://github.com/status-im/status-app/releases) 2.32.x or
later. Day to day it is tested in Google Chrome and Arc; Safari and Firefox Developer Edition work
too, with the extra steps below.

## Safari

```bash
pnpm --filter connector dev:safari
xcrun safari-web-extension-converter --no-open --macos-only --swift --project-location ./apps --app-name Status --bundle-identifier im.Status.Status ./build/safari-mv3-dev/
xcodebuild -project apps/Status/Status.xcodeproj -scheme Status build
```

There is no build script for Safari: the converter writes an Xcode project and `xcodebuild` builds
it. Safari does not reload the extension either, so rebuild and reconvert whenever you add a file.

## Firefox Developer Edition

```bash
pnpm --filter connector dev:firefox
pnpm --filter connector build:firefox
```

Install the zipped build (`build/firefox-mv3-prod.zip`) from Add-ons and Themes. The
[add-on signing guide](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox) covers what
Firefox expects from the package.

## Testing

Load the extension as above, open the page console and turn on logging:

```js
await connector.enableLogging(true)
```

To run Status Desktop with the connector flag on, on macOS:

```bash
FLAG_CONNECTOR_ENABLED=1 '/Volumes/Status Desktop/Status.app/Contents/MacOS/nim_status_client'
```

Point that path at the installer package location and leave the app you normally run alone.

## More

- [Agent guide](AGENTS.md)
