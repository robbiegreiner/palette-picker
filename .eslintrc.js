module.exports = {
  "extends": [
    "eslint:recommended",
  ],
  "env": {
    "browser": true,
    "mocha": true,
    "node": true,
    "es6": true,
    "jquery": true
  },
  // Having a problem with one of these rules? Learn more about it here: https://eslint.org/docs/rules/
  "rules": {
    "no-console": 0,
    "name-length": 0,
    "id-length": 0,
    "eqeqeq": ["error", "always"],
    "indent": ["warn", 2],
    "no-template-curly-in-string": "error",
    "semi": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "block-spacing": ["error", "always"],
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "comma-dangle": ["error", "never"],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never"],
    "func-call-spacing": ["error", "never"],
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "max-len": ["warn", 1280],
    "no-duplicate-imports": "error",
    "id-blacklist": ["error", "data", "err", "e", "cb", "callback", "payload", "obj", "arr"],
    "max-depth": ["warn", 4],
    "no-unused-vars": "warn"
  },
  "globals": {
    "expect": true
  }
}
