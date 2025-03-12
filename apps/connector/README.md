# A wallet connector by Status

Status Desktop Wallet extended to decentralized applications in your browser.

## Compatibility

Depends on:

- **[Status Desktop](https://github.com/status-im/status-desktop/releases)** >=2.32.x

Tested with these browsers:

- Google Chrome
- Arc

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

Google Chrome > Window > Extensions > Load unpacked > select build (build/chrome-mv3-dev)

> Note: Reloads automatically in development.

### Safari

#### Develop

```bash
pnpm dev:safari
```

#### Convert

```bash
xcrun safari-web-extension-converter --no-open --macos-only --swift --project-location ./apps --app-name Status --bundle-identifier im.Status.Status ./build/safari-mv3-dev/
```

#### Build

```bash
xcodebuild -project apps/Status/Status.xcodeproj -scheme Status build
```

#### Load

Safari > Settings... > Developer > Allow unsigned extensions

Safari > Settings... > Extensions > check Status

> Note: Does not reload automatically, requires build on change and converting as well if adding new files.

### Firefox Developer Edition

#### Develop

```bash
pnpm dev:firefox
```

#### Build

```bash
pnpm build:firefox
```

#### Load

https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox#w_what-are-my-options-if-i-want-to-use-an-unsigned-add-on-advanced-users

Firefox Developer Edition > Tools > Add-ons and Themes > click on gear icon (Tools for all add-ons) > Install Add-on From File... > select build (build/firefox-mv3-prod.zip)

> Note: Does not reload automatically, requires build and load on change.

### Status Desktop

#### Run

##### macOS

```bash
FLAG_CONNECTOR_ENABLED=1 '/Volumes/Status Desktop/Status.app/Contents/MacOS/nim_status_client'
```

> Tip: Point to the installer package location without dropping and replacing current app.

## Testing

Download latest build from last merged PR or build from source. To use the extension see the load steps from [Development](#development) section.

### Logging

Browser > Console

```
await connector.enableLogging(true)
```
