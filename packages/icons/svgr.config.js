function transformImports(arr) {
  arr.forEach(object => {
    if (object.source && object.source.value === 'react-native-svg') {
      object.specifiers.forEach(specifier => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          specifier.type = 'ImportSpecifier'
          specifier.imported = specifier.local
        }
      })
    }
  })
  return arr
}

const template = (variables, { tpl }) => {
  transformImports(variables.imports)

  return tpl`
${variables.imports};
import { useCurrentColor } from 'tamagui'

${variables.interfaces};

const ${variables.componentName} = (${variables.props}) => {
  const { color: colorToken = "currentColor", ...rest } = props;

const color = useCurrentColor(colorToken);

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
