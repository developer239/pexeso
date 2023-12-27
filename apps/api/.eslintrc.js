module.exports = {
  extends: [
    '@linters/eslint-config-node',
    '@linters/eslint-config-typescript',
    '@linters/eslint-config-vitest',
    'prettier',
  ],
  rules: {
    'no-void': 1,
  }
}
