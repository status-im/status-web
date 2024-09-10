/** @type {import('@svgr/core').Config} */
module.exports = {
  typescript: true,
  jsxRuntime: 'automatic',
  expandProps: 'end',
  filenameCase: 'kebab',
  // note: SVGO transformation is handled in the sync script
  svgo: false,
}
