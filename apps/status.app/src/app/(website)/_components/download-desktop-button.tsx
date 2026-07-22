'use client'

import { useEffect, useState } from 'react'

import { Button } from '@status-im/components'
import {
  AppleIcon,
  DesktopIcon,
  LinuxIcon,
  WindowsIcon,
} from '@status-im/icons/20'
import { useTranslations } from 'next-intl'
import { match } from 'ts-pattern'

import {
  ROUTES,
  STATUS_DESKTOP_DOWNLOAD_URL_LINUX,
  STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON,
  STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS,
  STATUS_RELEASES_LATEST_URL,
} from '~/config/routes'
import { isGetSite } from '~/config/site-scope'
import { trackEvent } from '~app/_utils/track'
import { useLatestReleaseTags } from '~website/_context/latest-release-tag-context'
import {
  type DownloadPlatform,
  startLatestDownload,
} from '~website/_lib/download-latest'

import { DownloadConnectorDialog } from './download-connector-dialog'

import type { DropdownButton } from '@status-im/components'

type ButtonProps = React.ComponentProps<typeof DropdownButton>

type Props = Pick<ButtonProps, 'variant' | 'size'> & {
  show?: 'single' | 'all'
  source?: 'sharing'
  // Render icon-only triggers (no text labels).
  iconOnly?: boolean
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
  const t = useTranslations('download')

  const prefix = t('prefix')
  const macos = t('macos')
  const windows = t('windows')
  const linux = t('linux')
  const desktop = t('desktop')

  useEffect(() => {
    const platform = document.documentElement.getAttribute('data-platform')
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
  iconOnly?: boolean
}

const LinuxDownloadButton = (props: DownloadButtonProps) => {
  const { source, iconOnly, ...buttonProps } = props
  const latestReleaseTags = useLatestReleaseTags()
  const t = useTranslations('download')

  const handleClick = (event: React.MouseEvent) => {
    if (isGetSite) {
      event.preventDefault()
      void startLatestDownload('linux')
    }

    trackEvent('Download', {
      store: 'direct',
      platform: 'linux',
      version: latestReleaseTags.desktop ?? 'unknown',
      source,
    })
  }

  if (iconOnly) {
    return (
      <DownloadConnectorDialog>
        <Button
          {...buttonProps}
          href={
            isGetSite
              ? STATUS_RELEASES_LATEST_URL
              : STATUS_DESKTOP_DOWNLOAD_URL_LINUX
          }
          icon={<LinuxIcon />}
          aria-label={t('downloadForLinux')}
          onClick={handleClick}
        />
      </DownloadConnectorDialog>
    )
  }

  return (
    <>
      <div className="hidden macos:contents windows:contents ios:contents android:contents">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={
              isGetSite
                ? STATUS_RELEASES_LATEST_URL
                : STATUS_DESKTOP_DOWNLOAD_URL_LINUX
            }
            icon={<LinuxIcon />}
            aria-label={t('downloadForLinux')}
            onClick={handleClick}
          />
        </DownloadConnectorDialog>
      </div>
      <div className="hidden linux:hidden xl:linux:block">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={
              isGetSite
                ? STATUS_RELEASES_LATEST_URL
                : STATUS_DESKTOP_DOWNLOAD_URL_LINUX
            }
            iconBefore={<LinuxIcon />}
            onClick={handleClick}
          >
            {t('downloadForLinux')}
          </Button>
        </DownloadConnectorDialog>
      </div>
    </>
  )
}

const WindowsDownloadButton = (props: DownloadButtonProps) => {
  const { source, iconOnly, ...buttonProps } = props
  const latestReleaseTags = useLatestReleaseTags()
  const t = useTranslations('download')

  const handleClick = (event: React.MouseEvent) => {
    if (isGetSite) {
      event.preventDefault()
      void startLatestDownload('windows')
    }

    trackEvent('Download', {
      store: 'direct',
      platform: 'windows',
      version: latestReleaseTags.desktop ?? 'unknown',
      source,
    })
  }

  if (iconOnly) {
    return (
      <DownloadConnectorDialog>
        <Button
          {...buttonProps}
          href={
            isGetSite
              ? STATUS_RELEASES_LATEST_URL
              : STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS
          }
          icon={<WindowsIcon />}
          aria-label={t('downloadForWindows')}
          onClick={handleClick}
        />
      </DownloadConnectorDialog>
    )
  }

  return (
    <>
      <div className="block macos:contents linux:contents ios:contents unknown:contents xl:hidden">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={
              isGetSite
                ? STATUS_RELEASES_LATEST_URL
                : STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS
            }
            icon={<WindowsIcon />}
            aria-label={t('downloadForWindows')}
            onClick={handleClick}
          />
        </DownloadConnectorDialog>
      </div>
      <div className="hidden windows:hidden xl:windows:block">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={
              isGetSite
                ? STATUS_RELEASES_LATEST_URL
                : STATUS_DESKTOP_DOWNLOAD_URL_WINDOWS
            }
            iconBefore={<WindowsIcon />}
            onClick={handleClick}
          >
            {t('downloadForWindows')}
          </Button>
        </DownloadConnectorDialog>
      </div>
    </>
  )
}

const MacOSDownloadButton = (props: DownloadButtonProps) => {
  const { source, iconOnly, ...buttonProps } = props
  const latestReleaseTags = useLatestReleaseTags()
  const t = useTranslations('download')

  const handleClick = (event: React.MouseEvent) => {
    if (isGetSite) {
      event.preventDefault()
      void startLatestDownload('macos-silicon')
    }

    trackEvent('Download', {
      platform: 'macos-silicon',
      version: latestReleaseTags.desktop ?? 'unknown',
      store: 'direct',
      source,
    })
  }

  if (iconOnly) {
    return (
      <DownloadConnectorDialog>
        <Button
          {...buttonProps}
          href={
            isGetSite
              ? STATUS_RELEASES_LATEST_URL
              : STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON
          }
          icon={<AppleIcon />}
          aria-label={t('downloadForMacOS')}
          onClick={handleClick}
        />
      </DownloadConnectorDialog>
    )
  }

  return (
    <>
      <div className="block windows:contents linux:contents ios:contents android:contents unknown:contents xl:hidden">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={
              isGetSite
                ? STATUS_RELEASES_LATEST_URL
                : STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON
            }
            icon={<AppleIcon />}
            aria-label={t('downloadForMacOS')}
            onClick={handleClick}
          />
        </DownloadConnectorDialog>
      </div>
      <div className="hidden macos:hidden xl:macos:block">
        <DownloadConnectorDialog>
          <Button
            {...buttonProps}
            href={
              isGetSite
                ? STATUS_RELEASES_LATEST_URL
                : STATUS_DESKTOP_DOWNLOAD_URL_MACOS_SILICON
            }
            iconBefore={<AppleIcon />}
            onClick={handleClick}
          >
            {t('downloadForMacOS')}
          </Button>
        </DownloadConnectorDialog>
      </div>
    </>
  )
}

const desktopAppsHref =
  ROUTES.apps.find(route => route.nameKey === 'desktop')?.href ??
  '/apps#desktop'

const getDesktopDownloadPlatform = (
  platform: string | null
): DownloadPlatform => {
  switch (platform) {
    case 'ios':
      return 'macos-silicon'
    case 'android':
      return 'windows'
    default:
      return 'macos-silicon'
  }
}

const DesktopDownloadButton = (props: DownloadButtonProps) => {
  const { source, ...buttonProps } = props
  const latestReleaseTags = useLatestReleaseTags()
  const t = useTranslations('download')

  const handleClick = (event: React.MouseEvent) => {
    if (isGetSite) {
      event.preventDefault()
      const platform = document.documentElement.getAttribute('data-platform')
      void startLatestDownload(getDesktopDownloadPlatform(platform))
    }

    trackEvent('Download', {
      store: 'direct',
      platform: getDesktopDownloadPlatform(
        document.documentElement.getAttribute('data-platform')
      ),
      version: latestReleaseTags.desktop ?? 'unknown',
      source,
    })
  }

  return (
    <>
      <div className="hidden ios:contents android:contents unknown:contents">
        <Button
          {...buttonProps}
          href={isGetSite ? STATUS_RELEASES_LATEST_URL : desktopAppsHref}
          iconBefore={
            <DesktopIcon
              className={match(props.variant)
                .with('outline', () => 'text-neutral-100 dark:text-neutral-40')
                .with('grey', () => 'text-neutral-80 dark:text-neutral-50')
                .otherwise(() => undefined)}
            />
          }
          onClick={handleClick}
        >
          {t('downloadForDesktop')}
        </Button>
      </div>
    </>
  )
}
