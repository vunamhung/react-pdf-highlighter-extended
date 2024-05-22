module.exports = {
  printWidth: 152,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: ['<TYPES>^react', '<TYPES>', '<BUILTIN_MODULES>', '^react$', '<THIRD_PARTY_MODULES>', '^~', '^[.]', '.css$'],
  importOrderTypeScriptVersion: '5.0.0',
  tailwindFunctions: ['cn', 'clsx', 'tv', 'classNames'],
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
};
