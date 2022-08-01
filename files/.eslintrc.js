module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "quotes": [1, "double"],
        "semi-spacing": [2, { "before": false, "after": true }],
        "semi": [1, "always"],
        "no-multi-spaces": [2, { exceptions: {
            "Property": true,
            "VariableDeclarator": true,
            "ImportDeclaration": true
        }}],
        "comma-spacing": [2, { "before": false, "after": true }],
        "block-spacing": [1, "always"],
        "no-trailing-spaces": [1],
        "no-whitespace-before-property": [2],
        "space-before-blocks": [2, "always"],
        "space-in-parens": [2, "never"],
        "space-before-function-paren": [2, {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
        }],
        "space-unary-ops": [2, {
            "words": true,
            "nonwords": false
        }],
        "spaced-comment": [1, "always", {
            "line": { "exceptions": ["-", "*"] },
            "block": { "exceptions": ["-", "*"] }
        }],
        "no-spaced-func": [2],
        "keyword-spacing": [1, {"before": true}],
        "space-infix-ops": [1]
    }
};

