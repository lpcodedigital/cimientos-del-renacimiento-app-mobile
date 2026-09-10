const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const tsParser = require("@typescript-eslint/parser");

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "web-build/**",
      "expo-env.d.ts",
      "*.min.js",
    ],
  },
  ...tsPlugin.configs["flat/recommended"],
  {
    files: [
      "eslint.config.js",
      "metro.config.js",
      "babel.config.js",
      "postcss.config.mjs",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["App.tsx"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
        formComponents: [],
        linkComponents: [],
      },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooksPlugin.configs.flat.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/self-closing-comp": "error",
      "react/jsx-no-leaked-render": ["error", { validStrategies: ["ternary"] }],
      "react-hooks/rules-of-hooks": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", args: "after-used" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
  {
    files: ["src/features/*/domain/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "react",
            "react-native",
            "axios",
            "@tanstack/*",
            "expo-secure-store",
            "expo-local-authentication",
            "expo-font",
            "expo-linear-gradient",
            "@/features/*/application/**",
            "@/features/*/infrastructure/**",
            "@/features/*/presentation/**",
            "@/shared/**",
            "@/app/**",
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/*/application/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "react",
            "react-native",
            "axios",
            "expo-secure-store",
            "expo-local-authentication",
            "expo-font",
            "expo-linear-gradient",
            "@/features/*/infrastructure/**",
            "@/features/*/presentation/**",
            "@/shared/infrastructure/**",
            "@/app/**",
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/features/*/presentation/**",
      "src/app/navigation/**",
      "src/shared/ui/**",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/features/*/infrastructure/**",
            "@/shared/infrastructure/**",
            "expo-secure-store",
            "expo-local-authentication",
            "axios",
          ],
        },
      ],
    },
  },
];

module.exports = config;
