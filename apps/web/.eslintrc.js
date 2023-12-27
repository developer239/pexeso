module.exports = {
  extends: [
    '@linters/eslint-config-react',
    '@linters/eslint-config-typescript',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.story.tsx'],
      rules: {
        'import/no-default-export': 0,
      },
    },
  ],
}
