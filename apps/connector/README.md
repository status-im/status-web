# connector

A wallet connector by Status: extends the Status Desktop Wallet to decentralised applications in
your browser. Built with Plasmo for Chrome, Safari and Firefox.

## Run

    pnpm --filter connector dev           # Chrome (alias of dev:chrome)
    pnpm --filter connector dev:safari
    pnpm --filter connector dev:firefox

Load the unpacked Chrome build from `build/chrome-mv3-dev`.

## Build

    pnpm --filter connector build          # Chrome, to build/chrome-mv3-prod
    pnpm --filter connector build:firefox  # Firefox, also zips the build

## Compatibility

Depends on [Status Desktop](https://github.com/status-im/status-app/releases) >= 2.32.x. Tested
with Google Chrome and Arc. Safari and Firefox Developer Edition are also supported (see below).

## Safari

    pnpm --filter connector dev:safari
    xcrun safari-web-extension-converter --no-open --macos-only --swift --project-location ./apps --app-name Status --bundle-identifier im.Status.Status ./build/safari-mv3-dev/
    xcodebuild -project apps/Status/Status.xcodeproj -scheme Status build

Safari does not reload automatically: rebuild and reconvert when adding new files.

## Firefox Developer Edition

    pnpm --filter connector dev:firefox
    pnpm --filter connector build:firefox

Install the zipped build (`build/firefox-mv3-prod.zip`) from Add-ons and Themes. See the
[add-on signing guide](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox).

## Testing

Use the load steps above, then enable logging from the page console:

    await connector.enableLogging(true)

To run Status Desktop with the connector enabled on macOS:

    FLAG_CONNECTOR_ENABLED=1 '/Volumes/Status Desktop/Status.app/Contents/MacOS/nim_status_client'

Point the path at the installer package location without replacing the current app.

## More

- [Agent guide](AGENTS.md)
