module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'default-case': 'warn',
    'react/jsx-no-duplicate-props': 'warn',
    'react/jsx-no-undef': 'warn'
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  }
};
