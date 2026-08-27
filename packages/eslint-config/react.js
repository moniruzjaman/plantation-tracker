import base from './base.js';
import pluginReact from 'eslint-plugin-react';

export default [
  ...base,
  {
    plugins: { react: pluginReact },
    languageOptions: {
      ...base[0]?.languageOptions,
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    settings: { react: { version: 'detect' } }
  }
];
