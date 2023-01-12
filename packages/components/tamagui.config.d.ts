import type { AnimationDriver, GenericFont, Variable } from '@tamagui/core'

export declare const config: {
  shouldAddPrefersColorThemes: boolean
  themeClassNameOnRoot: boolean
  animations: AnimationDriver<{
    bouncy: {
      damping: number
      mass: number
      stiffness: number
    }
    lazy: {
      damping: number
      stiffness: number
    }
    slow: {
      damping: number
      stiffness: number
    }
    quick: {
      damping: number
      mass: number
      stiffness: number
    }
    tooltip: {
      damping: number
      mass: number
      stiffness: number
    }
  }>
  media: {
    xl: {
      maxWidth: number
    }
    lg: {
      maxWidth: number
    }
    md: {
      maxWidth: number
    }
    sm: {
      maxWidth: number
    }
    xs: {
      maxWidth: number
    }
    xxs: {
      maxWidth: number
    }
    gtXs: {
      minWidth: number
    }
    gtSm: {
      minWidth: number
    }
    gtMd: {
      minWidth: number
    }
    gtLg: {
      minWidth: number
    }
    gtXl: {
      minWidth: number
    }
  }
  shorthands: {
    readonly ussel: 'userSelect'
    readonly cur: 'cursor'
    readonly pe: 'pointerEvents'
    readonly col: 'color'
    readonly ff: 'fontFamily'
    readonly fos: 'fontSize'
    readonly fost: 'fontStyle'
    readonly fow: 'fontWeight'
    readonly ls: 'letterSpacing'
    readonly lh: 'lineHeight'
    readonly ta: 'textAlign'
    readonly tt: 'textTransform'
    readonly ww: 'wordWrap'
    readonly ac: 'alignContent'
    readonly ai: 'alignItems'
    readonly als: 'alignSelf'
    readonly b: 'bottom'
    readonly bc: 'backgroundColor'
    readonly bg: 'backgroundColor'
    readonly bbc: 'borderBottomColor'
    readonly bblr: 'borderBottomLeftRadius'
    readonly bbrr: 'borderBottomRightRadius'
    readonly bbw: 'borderBottomWidth'
    readonly blc: 'borderLeftColor'
    readonly blw: 'borderLeftWidth'
    readonly boc: 'borderColor'
    readonly br: 'borderRadius'
    readonly bs: 'borderStyle'
    readonly brw: 'borderRightWidth'
    readonly brc: 'borderRightColor'
    readonly btc: 'borderTopColor'
    readonly btlr: 'borderTopLeftRadius'
    readonly btrr: 'borderTopRightRadius'
    readonly btw: 'borderTopWidth'
    readonly bw: 'borderWidth'
    readonly dsp: 'display'
    readonly f: 'flex'
    readonly fb: 'flexBasis'
    readonly fd: 'flexDirection'
    readonly fg: 'flexGrow'
    readonly fs: 'flexShrink'
    readonly fw: 'flexWrap'
    readonly h: 'height'
    readonly jc: 'justifyContent'
    readonly l: 'left'
    readonly m: 'margin'
    readonly mah: 'maxHeight'
    readonly maw: 'maxWidth'
    readonly mb: 'marginBottom'
    readonly mih: 'minHeight'
    readonly miw: 'minWidth'
    readonly ml: 'marginLeft'
    readonly mr: 'marginRight'
    readonly mt: 'marginTop'
    readonly mx: 'marginHorizontal'
    readonly my: 'marginVertical'
    readonly o: 'opacity'
    readonly ov: 'overflow'
    readonly p: 'padding'
    readonly pb: 'paddingBottom'
    readonly pl: 'paddingLeft'
    readonly pos: 'position'
    readonly pr: 'paddingRight'
    readonly pt: 'paddingTop'
    readonly px: 'paddingHorizontal'
    readonly py: 'paddingVertical'
    readonly r: 'right'
    readonly shac: 'shadowColor'
    readonly shar: 'shadowRadius'
    readonly shof: 'shadowOffset'
    readonly shop: 'shadowOpacity'
    readonly t: 'top'
    readonly w: 'width'
    readonly zi: 'zIndex'
  }
  themes: {
    light: {
      primary: Variable<string>
    }
    dark: {
      primary: Variable<string>
    }
  }
  tokens: {
    color: {
      'primary-50': Variable<string | Variable<string>>
      'primary-60': Variable<string | Variable<string>>
    }
    space: {
      0: Variable<number>
      0.25: Variable<number>
      0.5: Variable<number>
      0.75: Variable<number>
      1: Variable<number>
      1.5: Variable<number>
      2: Variable<number>
      2.5: Variable<number>
      3: Variable<number>
      3.5: Variable<number>
      4: Variable<number>
      true: Variable<number>
      4.5: Variable<number>
      5: Variable<number>
      6: Variable<number>
      7: Variable<number>
      8: Variable<number>
      9: Variable<number>
      10: Variable<number>
      11: Variable<number>
      12: Variable<number>
      13: Variable<number>
      14: Variable<number>
      15: Variable<number>
      16: Variable<number>
      17: Variable<number>
      18: Variable<number>
      19: Variable<number>
      20: Variable<number>
      '$-{SizeKeys}': Variable<number>
    }
    size: {
      0: Variable<number>
      0.25: Variable<number>
      0.5: Variable<number>
      0.75: Variable<number>
      1: Variable<number>
      1.5: Variable<number>
      2: Variable<number>
      2.5: Variable<number>
      3: Variable<number>
      3.5: Variable<number>
      4: Variable<number>
      true: Variable<number>
      4.5: Variable<number>
      5: Variable<number>
      6: Variable<number>
      7: Variable<number>
      8: Variable<number>
      9: Variable<number>
      10: Variable<number>
      11: Variable<number>
      12: Variable<number>
      13: Variable<number>
      14: Variable<number>
      15: Variable<number>
      16: Variable<number>
      17: Variable<number>
      18: Variable<number>
      19: Variable<number>
      20: Variable<number>
    }
    radius: {
      0: Variable<number>
      1: Variable<number>
      2: Variable<number>
      3: Variable<number>
      4: Variable<number>
      true: Variable<number>
      5: Variable<number>
      6: Variable<number>
      7: Variable<number>
      8: Variable<number>
      9: Variable<number>
      10: Variable<number>
      11: Variable<number>
      12: Variable<number>
    }
    zIndex: {
      0: Variable<number>
      1: Variable<number>
      2: Variable<number>
      3: Variable<number>
      4: Variable<number>
      5: Variable<number>
    }
  }
  fonts: {
    heading: GenericFont<
      | 9
      | 15
      | 10
      | 11
      | 12
      | 14
      | 16
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 13
      | 'true'
    >
    body: GenericFont<
      | 9
      | 15
      | 10
      | 11
      | 12
      | 14
      | 16
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 13
      | 'true'
    >
    mono: GenericFont<
      9 | 15 | 10 | 11 | 12 | 14 | 16 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 13
    >
  }
}

//# sourceMappingURL=tamagui.config.d.ts.map
