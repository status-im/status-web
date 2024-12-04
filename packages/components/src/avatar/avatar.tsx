import { cloneElement, useMemo } from 'react'

import { cva } from 'cva'
import { match } from 'ts-pattern'

import { generateIdenticonRing } from './utils'

import type { IconElement } from '../types'

type UserAvatarProps = {
  type: 'user'
  size: '80' | '56' | '48' | '32' | '28' | '24' | '20' | '16'
  name: string
  src?: string
  colorHash?: number[][]
}

type ChannelAvatarProps = {
  type: 'channel'
  size: '80' | '32' | '28' | '24' | '20'
  name: string
  emoji?: string
}

type CommunityAvatarProps = {
  type: 'community'
  size: '80' | '32' | '24' | '20'
  name: string
  src?: string
}

type AccountAvatarProps = {
  type: 'account'
  size: '80' | '48' | '32' | '28' | '24' | '20' | '16'
  name: string
  emoji: string
  bgOpacity?: '0' | '5' | '10' | '20' | '30' | '40' | '100'
}

type IconAvatarProps = {
  type: 'icon'
  size: '48' | '32' | '20'
  icon: IconElement
}

type Props =
  | UserAvatarProps
  | ChannelAvatarProps
  | CommunityAvatarProps
  | AccountAvatarProps
  | IconAvatarProps

const Avatar = (props: Props) => {
  const colorHash = 'colorHash' in props ? props.colorHash : undefined
  const identiconRing = useMemo(() => {
    if (colorHash) {
      const gradient = generateIdenticonRing(colorHash)
      return `conic-gradient(from 90deg, ${gradient})`
    }

    return
  }, [colorHash])

  return match(props)
    .with({ type: 'user' }, props => {
      const { size, src, name } = props

      return (
        <div
          className={baseStyles({
            size,
            rounded: 'full',
            padding: identiconRing ? size : undefined,
          })}
          style={{
            background: identiconRing,
          }}
        >
          {src ? (
            <img
              src={src}
              alt={name}
              className="size-full rounded-full object-cover"
            />
          ) : (
            <div className="flex size-full select-none items-center justify-center rounded-full bg-customisation-50 text-blur-white/70">
              {name
                ? name.slice(0, Number(size) < 28 ? 1 : 2).toUpperCase()
                : '?'}
            </div>
          )}
        </div>
      )
    })
    .with({ type: 'channel' }, props => {
      const { size, emoji } = props

      return (
        <div
          className={baseStyles({
            size,
            rounded: 'full',
            className: 'bg-customisation-50/10',
          })}
        >
          <span className="select-none text-customisation-50">{emoji}</span>
        </div>
      )
    })
    .with({ type: 'community' }, props => {
      const { size, src, name } = props

      return (
        <div className={baseStyles({ size, rounded: 'full' })}>
          {src ? (
            <img src={src} alt={name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full select-none items-center justify-center bg-neutral-95 text-neutral-50">
              {name ? name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
      )
    })
    .with({ type: 'icon' }, props => {
      const { icon: Icon, size } = props

      return (
        <div
          className={baseStyles({
            size,
            rounded: 'full',
            className: 'bg-customisation-50/20',
          })}
        >
          {Icon && cloneElement(Icon, { className: 'text-customisation-50' })}
        </div>
      )
    })
    .with({ type: 'account' }, props => {
      const { size, bgOpacity } = props

      return (
        <div
          className={baseStyles({
            accountSize: size,
            rounded: size,
            background: bgOpacity,
          })}
        >
          <div className="flex size-full select-none items-center justify-center text-white-100">
            {props.emoji}
          </div>
        </div>
      )
    })
    .exhaustive()
}

export { Avatar }
export type {
  AccountAvatarProps,
  Props as AvatarProps,
  ChannelAvatarProps,
  CommunityAvatarProps,
  IconAvatarProps,
  Props,
  UserAvatarProps,
}

const baseStyles = cva({
  base: 'relative flex items-center justify-center overflow-hidden',
  variants: {
    size: {
      '80': 'size-20 text-27',
      '64': 'size-16 text-19',
      '56': 'size-14 text-19',
      '48': 'size-12 text-15',
      '32': 'size-8 text-13',
      '28': 'size-7 text-13',
      '24': 'size-6 text-13',
      '20': 'size-5 text-11',
      '16': 'size-4 text-11',
    },
    accountSize: {
      '80': 'size-20 text-[36px]',
      '64': 'size-16 text-[32px]',
      '56': 'size-14 text-[28px]',
      '48': 'size-12 text-[24px]',
      '32': 'size-8 text-15',
      '28': 'size-7 text-[12px]',
      '24': 'size-6 text-[12px]',
      '20': 'size-5 text-[12px]',
      '16': 'size-4 text-[12px]',
    },
    rounded: {
      full: 'rounded-full',
      '80': 'rounded-16',
      '48': 'rounded-12',
      '32': 'rounded-10',
      '28': 'rounded-8',
      '24': 'rounded-8',
      '20': 'rounded-6',
      '16': 'rounded-6',
    },
    padding: {
      '80': 'p-1',
      '64': 'p-0.5',
      '56': 'p-0.5',
      '48': 'p-0.5',
      '32': 'p-0.5',
      '28': 'p-0',
      '24': 'p-0',
      '20': 'p-0',
      '16': 'p-0',
    },
    background: {
      '0': 'bg-transparent',
      '5': 'bg-customisation-50/5',
      '10': 'bg-customisation-50/10',
      '20': 'bg-customisation-50/20',
      '30': 'bg-customisation-50/30',
      '40': 'bg-customisation-50/40',
      '100': 'bg-customisation-50',
    },
  },
  defaultVariants: {
    background: '100',
  },
})
