'use client'

import { useEffect, useState } from 'react'

import { Button } from '@status-im/components'
import {
  AppleIcon,
  DesktopIcon,
  LinuxIcon,
  WindowsIcon,
} from '@status-im/icons/20'
import { match } from 'ts-pattern'

import {
  ROUTES,
  STATUS_DESKTOP_DOWNLOAD_URL_LINUX,
  STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON,
  STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS,
} from '~/config/routes'
import { trackEvent } from '~app/_utils/track'
import { useLatestReleaseTags } from '~website/_context/latest-release-tag-context'

import { DownloadConnectorDialog } from './download-connector-dialog'

import type { DropdownButton } from '@status-im/components'

type ButtonProps = React.ComponentProps<typeof DropdownButton>

type Props = Pick<ButtonProps, 'variant' | 'size'> & {
  show?: 'single' | 'all'
  source?: 'sharing'
}

const getDesktopEquivalent = (platform: string | null) => {
  switch (platform) {
    case 'ios':
      return 'macos'
    case 'android':
      return 'windows'
    default:
      return platform
  }
}

export const DownloadDesktopButton = (props: Props) => {
  const { show = 'single', source = null, ...buttonProps } = props
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null)

  const prefix = 'Download for'
  const macos = 'macOS'
  const windows = 'Windows'
  const linux = 'Linux'
  const desktop = 'desktop'

  useEffect(() => {
    const platform = document.body.getAttribute('data-platform')
    setCurrentPlatform(platform)
  }, [])

  const getVariantForPlatform = (targetPlatform: string) => {
    const mappedPlatform = getDesktopEquivalent(currentPlatform)
    return mappedPlatform === targetPlatform ? props.variant : 'outline'
  }

  if (show === 'single') {
    return (
      <>
        <div className="hidden macos:contents">
          <MacOSDownloadButton {...buttonProps} source={source}>
            <>
              {prefix} {macos}
            </>
          </MacOSDownloadButton>
        </div>

        <div className="hidden windows:contents">
          <WindowsDownloadButton {...buttonProps} source={source}>
            <>
              {prefix} {windows}
            </>
          </WindowsDownloadButton>
        </div>

        <div className="hidden linux:contents">
          <LinuxDownloadButton {...buttonProps} source={source}>
            <>
              {prefix} {linux}
            </>
          </LinuxDownloadButton>
        </div>

        <div className="hidden ios:contents android:contents unknown:contents">
          <DesktopDownloadButton {...buttonProps} source={source}>
            <>
              {prefix} {desktop}
            </>
          </DesktopDownloadButton>
        </div>
      </>
    )
  }

  return (
    <div className="flex gap-2">
      <div className="order-2 inline-flex macos:order-1 ios:order-1">
        <MacOSDownloadButton
          {...buttonProps}
          variant={getVariantForPlatform('macos')}
          source={source}
        >
          <span className="hidden macos:contents ios:contents unknown:contents">
            {prefix} {macos}
          </span>
        </MacOSDownloadButton>
      </div>

      <div className="order-2 inline-flex windows:order-1 android:order-1">
        <WindowsDownloadButton
          {...buttonProps}
          variant={getVariantForPlatform('windows')}
          source={source}
        >
          <span className="hidden windows:contents android:contents unknown:contents">
            {prefix} {windows}
          </span>
        </WindowsDownloadButton>
      </div>

      <div className="order-2 inline-flex linux:order-1 android:order-2 unknown:order-1">
        <LinuxDownloadButton
          {...buttonProps}
          variant={getVariantForPlatform('linux')}
          source={source}
        >
          <span className="hidden linux:contents unknown:contents">
            {prefix} {linux}
          </span>
        </LinuxDownloadButton>
      </div>
    </div>
  )
}

type DownloadButtonProps = Pick<
  ButtonProps,
  'children' | 'variant' | 'size'
> & {
  source: string | null
}

const LinuxDownloadButton = (props: DownloadButtonProps) => {
  const { source, ...buttonProps } = props
  const latestReleaseTags = useLatestReleaseTags()

  const handleClick = () => {
    trackEvent('Download', {
      store: 'direct',
      platform: 'linux',
      version: latestReleaseTags.desktop ?? 'unknown',
      source,
    })
  }
  return (
    <>
      <div className="hidden macos:contents windows:contents ios:contents android:contents">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={STATUS_DESKTOP_DOWNLOAD_URL_LINUX}
            icon={<LinuxIcon />}
            aria-label="Download for Linux"
            onClick={handleClick}
          />
        </DownloadConnectorDialog>
      </div>
      <div className="hidden linux:hidden xl:linux:block">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={STATUS_DESKTOP_DOWNLOAD_URL_LINUX}
            iconBefore={<LinuxIcon />}
            onClick={handleClick}
          >
            Download for Linux
          </Button>
        </DownloadConnectorDialog>
      </div>
    </>
  )
}

const WindowsDownloadButton = (props: DownloadButtonProps) => {
  const { source, ...buttonProps } = props
  const latestReleaseTags = useLatestReleaseTags()

  const handleClick = () => {
    trackEvent('Download', {
      store: 'direct',
      platform: 'windows',
      version: latestReleaseTags.desktop ?? 'unknown',
      source,
    })
  }

  return (
    <>
      <div className="block macos:contents linux:contents ios:contents unknown:contents xl:hidden">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS}
            icon={<WindowsIcon />}
            aria-label="Download for Windows"
            onClick={handleClick}
          />
        </DownloadConnectorDialog>
      </div>
      <div className="hidden windows:hidden xl:windows:block">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS}
            iconBefore={<WindowsIcon />}
            onClick={handleClick}
          >
            Download for Windows
          </Button>
        </DownloadConnectorDialog>
      </div>
    </>
  )
}

const MacOSDownloadButton = (props: DownloadButtonProps) => {
  const { source, ...buttonProps } = props
  const latestReleaseTags = useLatestReleaseTags()

  const handleClick = () => {
    trackEvent('Download', {
      platform: 'macos-silicon',
      version: latestReleaseTags.desktop ?? 'unknown',
      store: 'direct',
      source,
    })
  }

  return (
    <>
      <div className="block windows:contents linux:contents ios:contents android:contents unknown:contents xl:hidden">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON}
            icon={<AppleIcon />}
            aria-label="Download for macOS"
            onClick={handleClick}
          />
        </DownloadConnectorDialog>
      </div>
      <div className="hidden macos:hidden xl:macos:block">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON}
            iconBefore={<AppleIcon />}
            onClick={handleClick}
          >
            Download for macOS
          </Button>
        </DownloadConnectorDialog>
      </div>
    </>
  )
}

const DesktopDownloadButton = (props: DownloadButtonProps) => {
  return (
    <>
      <div className="hidden ios:contents android:contents unknown:contents">
        <Button
          {...props}
          href={ROUTES.Apps[1].href}
          iconBefore={
            <DesktopIcon
              className={match(props.variant)
                .with('outline', () => 'text-neutral-100 dark:text-neutral-40')
                .with('grey', () => 'text-neutral-80 dark:text-neutral-50')
                .otherwise(() => undefined)}
            />
          }
        >
          Download for desktop
        </Button>
      </div>
    </>
  )
}
