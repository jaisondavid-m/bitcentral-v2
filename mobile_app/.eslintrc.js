module.exports = {
  root: true,
  extends: ['expo'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    'react-hooks/set-state-in-effect': 'off',
    'react-hooks/immutability': 'off',
  },
};
