module.exports = {
  extends: [
    '@linters/eslint-config-react',
    '@linters/eslint-config-typescript',
    'prettier',
  ],
  rules: {
    'react/require-default-props': 0,
  },
  overrides: [
    {
      files: ['*.story.tsx'],
      rules: {
        'import/no-default-export': 0,
      },
    },
  ],
}
