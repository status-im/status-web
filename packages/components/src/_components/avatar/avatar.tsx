// import { cloneElement, useMemo, useState } from 'react'

// import { LockedIcon, MembersIcon, UnlockedIcon } from '@status-im/icons'
// import { Stack, styled, Unspaced } from '@tamagui/core'
import { cva } from 'cva'
// import { Platform } from 'react-native'
import { match } from 'ts-pattern'

// import { Image } from '../image'
// import { Text } from '../text'
// import { tokens } from '../tokens'
// import { generateIdenticonRing } from './utils'
// import type { TextProps } from '../text'
// import type { RadiusTokens } from '../tokens'
import type { IconComponent } from '../types'
// import type { customisation } from '@status-im/colors'
// import type { IconProps } from '@status-im/icons'
// import type { ColorTokens, GetStyledVariants } from '@tamagui/core'

type UserAvatarProps = {
  type: 'user'
  size: '80' | '56' | '48' | '32' | '28' | '24' | '20' | '16'
  name: string
  src?: string
  // backgroundColor?: ColorTokens
  // indicator?: GetStyledVariants<typeof Indicator>['state']
  // colorHash?: number[][]
}

// type GroupAvatarProps = {
//   type: 'group'
//   size: 80 | 48 | 32 | 28 | 20
//   name: string
//   src?: string
//   backgroundColor?: ColorTokens
// }

// type WalletAvatarProps = {
//   type: 'wallet'
//   size: 80 | 48 | 32 | 28 | 20
//   name: string
//   backgroundColor?: ColorTokens
// }

type ChannelAvatarProps = {
  type: 'channel'
  size: '80' | '32' | '28' | '24' | '20'
  name: string
  emoji?: string
  // backgroundColor?: ColorTokens
  // background?: ColorTokens
  // lock?: 'locked' | 'unlocked'
}

type CommunityAvatarProps = {
  type: 'community'
  size: '32' | '24' | '20'
  name: string
  src?: string
  // backgroundColor?: ColorTokens
}

// type AccountAvatarProps = {
//   type: 'account'
//   size: 80 | 48 | 32 | 28 | 24 | 20 | 16
//   name: string
//   src?: string
//   // backgroundColor?: ColorTokens
// }

type IconAvatarProps = {
  type: 'icon'
  size: '48' | '32' | '20' // 28 | 24 | 20 | 16
  icon: IconComponent
  // color: keyof typeof customisation
  // backgroundColor?: ColorTokens
  // color?: ColorTokens
}

type Props =
  | UserAvatarProps
  // | GroupAvatarProps
  // | WalletAvatarProps
  | ChannelAvatarProps
  | CommunityAvatarProps
  // | AccountAvatarProps
  | IconAvatarProps

type ImageLoadingStatus = 'loading' | 'loaded' | 'error'

// const userPaddingSizes: Record<UserAvatarProps['size'], number> = {
//   '80': 4,
//   '56': 2,
//   '48': 2,
//   '32': 2,
//   '28': 0,
//   '24': 0,
//   '20': 0,
//   '16': 0,
// }

// const accountRadiusSizes: Record<AccountAvatarProps['size'], RadiusTokens> = {
//   '80': '$16',
//   '48': '$12',
//   '32': '$10',
//   '28': '$8',
//   '24': '$8',
//   '20': '$6',
//   '16': '$6',
// }

// const channelEmojiSizes: Record<ChannelAvatarProps['size'], TextProps['size']> =
//   {
//     // todo: design review
//     '80': 27,
//     '32': 15,
//     '28': 13,
//     '24': 13,
//     '20': 11,
//   }

// const textSizes: Record<NonNullable<Props['size']>, TextProps['size']> = {
//   '80': 27,
//   '56': 19,
//   '48': 19,
//   '32': 15,
//   '28': 13,
//   '24': 13,
//   '20': 11,
//   '16': 11,
// }

// const groupMembersIconSizes: Record<
//   GroupAvatarProps['size'],
//   IconProps['size'] | number // to scales SVG
// > = {
//   // todo: design review
//   '80': 36,
//   '48': 20,
//   '32': 16,
//   '28': 16,
//   '20': 12,
// }

// const channelLockIconVariants: Record<
//   ChannelAvatarProps['size'],
//   {
//     baseVariant: GetStyledVariants<typeof LockBase>['variant']
//     iconSize: IconProps['size'] | number // to scales SVG
//   }
// > = {
//   // todo: design review
//   '80': { baseVariant: 80, iconSize: 40 },
//   '32': { baseVariant: 24, iconSize: 12 },
//   '28': { baseVariant: 24, iconSize: 12 },
//   '24': { baseVariant: 24, iconSize: 12 },
//   '20': { baseVariant: 20, iconSize: 12 },
// }

const Avatar = (props: Props) => {
  return match(props)
    .with({ type: 'user' }, props => {
      const { size, src, name } = props
      return (
        <div className={baseStyles({ size, rounded: 'full' })}>
          {src ? (
            <img src={src} alt={name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-neutral-95 text-neutral-50">
              {name ? name.charAt(0).toUpperCase() : '?'}
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
            className: 'bg-blue-50/20',
          })}
        >
          <span className="text-blue-50">{emoji}</span>
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
            <div className="flex size-full items-center justify-center bg-neutral-95 text-neutral-50">
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
          <Icon className="text-customisation-50" />
        </div>
      )
    })
    .exhaustive()

  // const colorHash = 'colorHash' in props ? props.colorHash : undefined
  // const identiconRing = useMemo(() => {
  //   if (colorHash) {
  //     const gradient = generateIdenticonRing(colorHash)
  //     return `conic-gradient(from 90deg, ${gradient})`
  //   }
  // }, [colorHash])

  // const [status, setStatus] = useState<ImageLoadingStatus>()

  // const padding =
  //   props.type === 'user' && identiconRing ? userPaddingSizes[props.size] : 0
  // const radius: RadiusTokens =
  //   props.type === 'account' ? accountRadiusSizes[props.size] : '$full'
  // const backgroundColor = getBackgroundColor()

  // function getBackgroundColor(): ColorTokens {
  //   if ('src' in props && props.src) {
  //     switch (status) {
  //       case 'error':
  //         break
  //       case 'loaded':
  //         return '$transparent'
  //       case 'loading':
  //       default:
  //         return '$white-100'
  //     }
  //   }

  //   if (props.backgroundColor) {
  //     return props.backgroundColor
  //   }

  //   if (props.type === 'channel') {
  //     return '$blue/20'
  //   }

  //   return '$neutral-95'
  // }

  // const renderContent = () => {
  //   switch (props.type) {
  //     case 'user':
  //     case 'account':
  //     case 'group':
  //     case 'community': {
  //       if (!props.src) {
  //         return (
  //           <Fallback borderRadius={radius} backgroundColor={backgroundColor}>
  //             {/* todo?: contrasting color to background */}
  //             {props.type === 'group' ? (
  //               <MembersIcon
  //                 size={groupMembersIconSizes[props.size] as IconProps['size']}
  //                 color="$white-100"
  //               />
  //             ) : (
  //               <Text
  //                 size={textSizes[props.size]}
  //                 weight="medium"
  //                 color="$white-100"
  //                 select={false}
  //               >
  //                 {props.name
  //                   .slice(
  //                     0,
  //                     props.type === 'user' &&
  //                       props.size < 28 &&
  //                       (!props.indicator || props.indicator === 'none')
  //                       ? 1
  //                       : 2,
  //                   )
  //                   .toUpperCase()}
  //               </Text>
  //             )}
  //           </Fallback>
  //         )
  //       }

  //       return (
  //         <>
  //           <Image
  //             src={props.src}
  //             backgroundColor={backgroundColor}
  //             // todo: use tamagui image with token support
  //             borderRadius={
  //               tokens.radius[
  //                 radius
  //                   .toString()
  //                   .replace('$', '') as keyof typeof tokens.radius
  //               ].val
  //             }
  //             width="full"
  //             aspectRatio={1}
  //             onLoadStart={() => {
  //               if (status) {
  //                 return
  //               }

  //               setStatus('loading')
  //             }}
  //             onLoad={() => setStatus('loaded')}
  //             onError={() => setStatus('error')}
  //           />
  //           {/* todo?: add fallback to Image */}
  //           {status === 'error' && (
  //             <Fallback
  //               borderRadius={radius}
  //               backgroundColor={backgroundColor}
  //             />
  //           )}
  //         </>
  //       )
  //     }
  //     case 'wallet':
  //       return (
  //         <Fallback borderRadius={radius} backgroundColor={backgroundColor}>
  //           <Text
  //             size={textSizes[props.size]}
  //             weight="medium"
  //             color="$white-100"
  //             select={false}
  //           >
  //             {props.name.slice(0, props.size < 24 ? 1 : 2).toUpperCase()}
  //           </Text>
  //         </Fallback>
  //       )
  //     case 'channel':
  //       if (props.emoji) {
  //         return (
  //           <Text size={channelEmojiSizes[props.size]} select={false}>
  //             {props.emoji}
  //           </Text>
  //         )
  //       }

  //       return (
  //         <Text size={textSizes[props.size]} select={false}>
  //           {props.name.slice(0, 1).toUpperCase()}
  //         </Text>
  //       )
  //     case 'icon':
  //       return cloneElement(props.icon, { color: props.color ?? '$white-100' })
  //     default:
  //       return
  //   }
  // }

  // const renderBadge = () => {
  //   switch (props.type) {
  //     case 'user': {
  //       const { indicator = 'none', size } = props

  //       if (!indicator || indicator === 'none') {
  //         return
  //       }

  //       return (
  //         <Unspaced>
  //           <Indicator size={size} state={indicator} />
  //         </Unspaced>
  //       )
  //     }
  //     case 'channel': {
  //       if (!props.lock) {
  //         return
  //       }

  //       const iconVariant = channelLockIconVariants[props.size]

  //       return (
  //         <LockBase variant={iconVariant.baseVariant}>
  //           {props.lock === 'locked' ? (
  //             <LockedIcon size={iconVariant.iconSize as IconProps['size']} />
  //           ) : (
  //             <UnlockedIcon size={iconVariant.iconSize as IconProps['size']} />
  //           )}
  //         </LockBase>
  //       )
  //     }
  //     default:
  //       return
  //   }
  // }

  // return (
  //   <Stack style={{ position: 'relative', height: 'fit-content' }}>
  //     <Base
  //       borderRadius={radius}
  //       padding={padding}
  //       size={props.size}
  //       backgroundColor={backgroundColor}
  //       // todo?: https://reactnative.dev/docs/images.html#background-image-via-nesting or svg instead
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-ignore
  //       style={{
  //         ...(Platform.OS === 'web' && {
  //           background: identiconRing,
  //         }),
  //       }}
  //     >
  //       {renderContent()}
  //     </Base>
  //     {renderBadge()}
  //   </Stack>
  // )
}

export { Avatar }
export type {
  Props as AvatarProps,
  // AccountAvatarProps,
  ChannelAvatarProps,
  CommunityAvatarProps,
  // GroupAvatarProps,
  IconAvatarProps,
  Props,
  UserAvatarProps,
  // WalletAvatarProps,
}

const baseStyles = cva({
  base: 'relative flex items-center justify-center overflow-hidden',
  variants: {
    rounded: {
      full: 'rounded-full',
    },
    size: {
      '80': 'size-20',
      '56': 'size-14',
      '48': 'size-12',
      '32': 'size-8',
      '28': 'size-7',
      '24': 'size-6',
      '20': 'size-5',
      '16': 'size-4',
    },
  },
})

// const fallbackStyles = cva('flex size-full items-center justify-center')

// const indicatorStyles = cva({
//   base: 'absolute z-10 rounded-full border-2 border-white-100',
//   variants: {
//     size: {
//       80: 'bottom-1 right-1 size-4',
//       56: 'bottom-0.5 right-0.5 size-3',
//       48: 'bottom-0 right-0 size-3',
//       32: '-bottom-0.5 -right-0.5 size-3',
//       28: '-bottom-0.5 -right-0.5 size-3',
//       24: '-bottom-0.5 -right-0.5 size-3',
//       20: 'hidden',
//       16: 'hidden',
//     },
//     state: {
//       none: '',
//       online: 'bg-success-50',
//       offline: 'bg-neutral-40',
//     },
//   },
// })

// const lockBaseStyles = cva({
//   base: 'absolute flex items-center justify-center rounded-full bg-white-100',
//   variants: {
//     variant: {
//       80: '-bottom-3.5 -right-3.5 size-12',
//       24: '-bottom-1 -right-1',
//       20: '-bottom-1.5 -right-1.5',
//     },
//   },
//   defaultVariants: {
//     variant: '24',
//   },
// })
