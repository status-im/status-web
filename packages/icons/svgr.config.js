/** @type {import('@svgr/babel-plugin-transform-svg-component').Template} */
const template = (variables, { tpl }) => {
  return tpl`
      import { createIcon } from '../lib/create-icon'
      ${'\n'}
      const ${variables.componentName} = createIcon((props) => {
        return (
          ${variables.jsx}
        )
      });
      ${'\n'}
      ${variables.exports};
`
}

/** @type {import('@svgr/core').Config} */
module.exports = {
  typescript: true,
  jsxRuntime: 'automatic',
  expandProps: 'start',
  svgProps: {
    focusable: '{false}',
    'aria-hidden': '{true}',
    width: '{props.width}',
    height: '{props.height}',
  },
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // viewBox is required to resize SVGs with CSS.
            // @see https://github.com/svg/svgo/issues/1128
            removeViewBox: false,
          },
        },
      },
      'prefixIds',
    ],
  },
  replaceAttrValues: {
    // currentColor: '{props.color}',
    '#09101C': '{props.color}',
    '#000': '{props.color}',
    '#0D1625': '{props.color}',
  },
  filenameCase: 'kebab',
  template,
}
