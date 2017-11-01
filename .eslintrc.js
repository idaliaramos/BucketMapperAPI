module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2017
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  rules: {
    'no-unused-vars': ['error', { args: 'none' }]
    // 'no-console': "off",
    // 'no-debugger': 'off'
  }
};
