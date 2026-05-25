let iconNames = []

try {
  const icons = require('@status-im/icons/20')
  iconNames = Object.keys(icons)
} catch {
  // @status-im/icons must be built (`pnpm --filter @status-im/icons build`) for MDX ESLint globals
}

module.exports = {
  iconNames,
}
