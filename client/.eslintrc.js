module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'no-unused-vars': 'off',
    'jsx-a11y/anchor-is-valid': 'off'
  }
};