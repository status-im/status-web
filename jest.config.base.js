module.exports = {
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      { configFile: require.resolve('./babel.config') },
    ],
  },
  watchPathIgnorePatterns: ['\\/node_modules\\/'],
}
