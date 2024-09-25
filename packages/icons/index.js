// @see https://github.com/tailwindlabs/heroicons/blob/master/react/index.esm.js
module.exports = new Proxy(
  {},
  {
    get: (_, property) => {
      if (property === '__esModule') {
        return {}
      }

      throw new Error(
        `Importing from \`@status-im/icons\` directly is not supported. Please import from either \`@status-im/icons/12\`, \`@status-im/icons/16\`, \`@status-im/icons/20\`, \`@status-im/icons/reactions\`, or \`@status-im/icons/social\` instead.`,
      )
    },
  },
)
