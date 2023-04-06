function transformImports(arr) {
  arr.forEach(object => {
    if (object.source && object.source.value === 'react-native-svg') {
      object.specifiers.forEach((specifier, index) => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          specifier.type = 'ImportSpecifier'
          specifier.imported = specifier.local
        }

        if (specifier.imported.name === 'IconProps') {
          object.specifiers.splice(index, 1)
        }
      })
    }
  })
}

function replaceSvgPropsWithIconProps(node) {
  node[0].typeAnnotation.typeAnnotation.typeName.name = 'IconProps'
}

const template = (variables, { tpl }) => {
  replaceSvgPropsWithIconProps(variables.props)
  transformImports(variables.imports)

  return tpl`
  ${variables.imports};
  import { useTheme } from '@tamagui/core';
  import { IconProps } from '../types';

${variables.interfaces};

const ${variables.componentName} = (${variables.props}) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme();


  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    ${variables.jsx}
  )
};

${variables.exports};
`
}

const COLORS = ['#09101C']

module.exports = {
  typescript: true,
  jsxRuntime: 'automatic',
  native: true,
  replaceAttrValues: {
    ...COLORS.reduce((acc, color) => {
      acc[color] = '{color}'
      return acc
    }, {}),
  },
  outDir: '.',
  filenameCase: 'kebab',
  template,
}
