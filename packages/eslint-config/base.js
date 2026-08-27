import globals from 'globals';

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { sourceType: 'module' }
    }
  }
];
