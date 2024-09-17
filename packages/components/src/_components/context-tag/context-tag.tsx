import { cloneElement } from 'react'

import { ChevronRightIcon } from '@status-im/icons/20'
// import { Stack, styled } from '@tamagui/core'
import { cva } from 'cva'
import { match } from 'ts-pattern'

import { Avatar } from '../avatar'

import type { IconComponent } from '../types'

type Props = { blur?: boolean; outline?: boolean } & (
  | {
      size?: '20' | '32'
    }
  | {
      size?: '24'
      textSize: '13' | '15'
    }
) &
  // | { type: 'user'; user: { name: string; src: string } }
  // | { type: 'account'; account: { name: string; emoji: string } }
  // | {
  //     type: 'group'
  //     group: {
  //       name: string
  //       icon: React.ReactElement
  //     }
  //   }
  (| { type: 'community'; community: { name: string; src?: string } }
    // | {
    //     type: 'channel'
    //     channel: { communityName: string; src: string; name: string }
    //   }
    | { type: 'token'; token: { name: string; src: string } }
    | { type: 'network'; network: { name: string; src: string } }
    // | { type: 'collectible'; collectible: { name: string; src: string } }
    // | { type: 'address'; address: string }
    | { type: 'icon'; icon: IconComponent; label: string }
    // | { type: 'audio'; audioLength: string }
    | { type: 'label'; children: string }
  )

// const textSizes: Record<
//   Exclude<NonNullable<Props['size']>, 24>,
//   Extract<TextProps['size'], 13 | 15>
// > = {
//   '32': 15,
//   /**
//    * note: "These context sizes are the same size as the ones above (24px), but the text size differs.
//    * We can have a bigger or smaller text depending on the context."
//    *
//    * – https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n?node-id=1336:34320&mode=design#541570513
//    */
//   // '24': 15,
//   '20': 13,
// }

// const avatarSizes: Record<
//   NonNullable<Props['size']>,
//   Extract<AvatarProps['size'], 28 | 20 | 16>
// > = {
//   '32': 28,
//   '24': 20,
//   '20': 16,
// }

// const iconSizes: Record<NonNullable<Props['size']>, IconProps['size']> = {
//   '32': 20,
//   '24': 12,
//   '20': 12,
// }

// const chevronIconSize: Record<
//   NonNullable<Props['size']>,
//   ComponentProps<typeof ChevronRightIcon>['size']
// > = {
//   '32': 20,
//   '24': 16,
//   '20': 12,
// }

// const Label = (props: {
//   children: string
//   size: 13 | 15
//   type?: 'default' | 'monospace'
// }) => {
//   const { children, size, type = 'default' } = props

//   return (
//     <Text
//       size={size}
//       weight="medium"
//       color="$neutral-100"
//       type={type}
//       select={false}
//     >
//       {children}
//     </Text>
//   )
// }

const baseStyles = cva({
  base: 'inline-flex cursor-default flex-row items-center',
  variants: {
    outline: {
      true: 'border border-customisation-50',
    },
    blur: {
      true: 'bg-neutral-80/5',
      false: 'bg-neutral-10',
    },
    size: {
      '32': 'h-8 gap-2 px-3 text-15',
      '24': 'h-6 gap-1 px-2 text-15',
      '20': 'h-5 gap-1 px-1.5 text-13',
    },
  },
  defaultVariants: {
    blur: false,
  },
})

const ContextTag = (props: Props) => {
  const { blur = false, outline } = props

  return match(props)
    .with({ type: 'label' }, ({ children, size }) => {
      return (
        <div className={baseStyles({ size, blur, outline })}>
          <span className="font-medium text-neutral-100">{children}</span>
        </div>
      )
    })
    .with({ type: 'community' }, ({ community, size }) => {
      return (
        <div className={baseStyles({ size, blur, outline })}>
          <Avatar
            type="community"
            size="32"
            src={community.src}
            name={community.name}
          />
          <span className="font-medium text-neutral-100">{community.name}</span>
        </div>
      )
    })
    .with({ type: 'token' }, ({ token, size }) => {
      return (
        <div className={baseStyles({ size, blur, outline })}>
          <Avatar type="icon" size="32" icon={token.icon} />
          <span className="font-medium text-neutral-100">{token.symbol}</span>
        </div>
      )
    })
    .with({ type: 'network' }, ({ network, size }) => {
      return (
        <div className={baseStyles({ size, blur, outline })}>
          <Avatar
            type="community"
            size="32"
            src={network.src}
            name={network.name}
          />
          <span className="font-medium text-neutral-100">{network.name}</span>
        </div>
      )
    })
    .with({ type: 'icon' }, ({ icon: Icon, label, size }) => {
      return (
        <div className={baseStyles({ size, blur, outline })}>
          {/* {cloneElement(icon, {
            size: size === 32 ? 20 : 16,
            color: '$neutral-50',
          })} */}

          <Icon />
          <span className="font-medium text-neutral-100">{label}</span>
        </div>
      )
    })
    .exhaustive()

  // const rounded = type === 'account' || type === 'collectible'
  // const hasAvatar = type !== 'address' && type !== 'icon' && type !== 'label'

  // let textSize: Extract<TextProps['size'], 13 | 15>
  // let paddingHorizontal: number | undefined
  // if (size === 24) {
  //   textSize = 'textSize' in props ? props.textSize : 13 // default if props.size not set but fallbacked to 24
  //   paddingHorizontal = textSize === 13 ? 8 : 6
  // } else {
  //   textSize = textSizes[size]
  // }

  // const renderContent = () => {
  //   switch (type) {
  //     case 'user': {
  //       return (
  //         <>
  //           <Avatar
  //             type="user"
  //             size={avatarSizes[size]}
  //             src={props.user.src}
  //             name={props.user.name}
  //           />
  //           <Label size={textSize}>{props.user.name}</Label>
  //         </>
  //       )
  //     }
  //     case 'community': {
  //       return (
  //         <>
  //           <Avatar
  //             type="community"
  //             size={avatarSizes[size]}
  //             src={props.community.src}
  //             name={props.community.name}
  //           />
  //           <Label size={textSize}>{props.community.name}</Label>
  //         </>
  //       )
  //     }
  //     case 'channel': {
  //       return (
  //         <>
  //           <Avatar
  //             type="community"
  //             size={avatarSizes[size]}
  //             src={props.channel.src}
  //             name={props.channel.name}
  //           />
  //           <Stack flexDirection="row" gap="$0" alignItems="center">
  //             <Label size={textSize}>{props.channel.communityName}</Label>
  //             <ChevronRightIcon
  //               color="$neutral-50"
  //               size={chevronIconSize[size]}
  //             />
  //             <Label size={textSize}>{`# ` + props.channel.name}</Label>
  //           </Stack>
  //         </>
  //       )
  //     }
  //     case 'token': {
  //       return (
  //         <>
  //           <Avatar
  //             type="community"
  //             size={avatarSizes[size]}
  //             src={props.token.src}
  //             name={props.token.name}
  //           />
  //           <Label size={textSize}>{props.token.name}</Label>
  //         </>
  //       )
  //     }
  //     case 'address': {
  //       return (
  //         <Label size={textSize} type="monospace">
  //           {props.address}
  //         </Label>
  //       )
  //     }
  //     case 'audio': {
  //       return (
  //         <>
  //           <Avatar
  //             type="icon"
  //             size={avatarSizes[size]}
  //             icon={<PlayIcon size={16} />}
  //             backgroundColor="$blue-50"
  //             color="$white-100"
  //           />
  //           <Label size={textSize}>{props.audioLength}</Label>
  //         </>
  //       )
  //     }
  //     case 'account': {
  //       return (
  //         <>
  //           <Avatar
  //             type="account"
  //             size={avatarSizes[size]}
  //             name={props.account.emoji}
  //           />
  //           <Label size={textSize}>{props.account.name}</Label>
  //         </>
  //       )
  //     }
  //     case 'group': {
  //       return (
  //         <>
  //           <Avatar
  //             type="icon"
  //             size={avatarSizes[size]}
  //             backgroundColor="$purple-50"
  //             color="$white/70"
  //             icon={props.group.icon}
  //           />
  //           <Label size={textSize}>{props.group.name}</Label>
  //         </>
  //       )
  //     }
  //     case 'network': {
  //       return (
  //         <>
  //           <Avatar
  //             type="community"
  //             size={avatarSizes[size]}
  //             src={props.network.src}
  //             name={props.network.name}
  //           />
  //           <Label size={textSize}>{props.network.name}</Label>
  //         </>
  //       )
  //     }
  //     case 'collectible': {
  //       return (
  //         <>
  //           {/* fixme: not an avatar but a resized image; see https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n?node-id=1336:34320&mode=design#541620575 */}
  //           <Avatar
  //             type="account"
  //             size={avatarSizes[size]}
  //             src={props.collectible.src}
  //             name={props.collectible.name}
  //           />
  //           <Label size={textSize}>{props.collectible.name}</Label>
  //         </>
  //       )
  //     }
  //     case 'icon': {
  //       return (
  //         <>
  //           {cloneElement(props.icon, {
  //             size: iconSizes[size],
  //             color: '$neutral-50',
  //           })}
  //           <Label size={textSize}>{props.label}</Label>
  //         </>
  //       )
  //     }
  //     case 'label': {
  //       return <Label size={textSize}>{props.children}</Label>
  //     }
  //   }
  // }

  // return (
  //   <Base
  //     outline={outline}
  //     blur={blur}
  //     borderRadius={rounded ? '$8' : '$full'}
  //     size={size}
  //     {...(paddingHorizontal && { paddingHorizontal })}
  //     {...(hasAvatar && { paddingLeft: 2 })}
  //     {...(hasAvatar && outline && { paddingLeft: 1 })}
  //   >
  //     {renderContent()}
  //   </Base>
  // )
}

export { ContextTag }
export type { Props as ContextTagProps }
