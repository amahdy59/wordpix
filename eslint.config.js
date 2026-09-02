import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import i18next from "eslint-plugin-i18next";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "src/imports/**", "scripts/**", "scratch/**"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      i18next,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // Internationalization (i18n): Prevent hardcoded UI strings
      "i18next/no-literal-string": [
        "warn",
        {
          mode: "jsx-text-only",
          "should-validate-template": false,
          ignoreCallee: ["t", "formatNumber", "cn", "classNames", "clsx"],
          ignoreAttribute: [
            "className",
            "style",
            "key",
            "id",
            "name",
            "type",
            "to",
            "href",
            "src",
            "alt",
            "target",
            "rel",
            "d",
            "viewBox",
            "fill",
            "stroke",
            "strokeWidth",
            "strokeLinecap",
            "strokeLinejoin",
            "aria-label",
            "aria-describedby",
            "aria-labelledby",
            "role",
            "lang",
            "dir",
            "data-*",
            "data-testid",
          ],
          ignore: [
            "^[0-9]+$",
            "^[/\\-.,;:!?#%&*+<=>@^_`|~'\"()\\[\\]{}]+$",
            "^[A-Z0-9_]+$",
            "^[0-9]+%?$",
            "^CEFR$",
            "^A1|A2|B1|B2|C1|C2$",
            "^WordPix$",
          ],
        },
      ],

      // The codebase deliberately uses `_`-prefixed throwaways in test tables.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],

      // This project's whole point is accessibility; these are not advisory.
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-noninteractive-element-interactions": "error",
      "jsx-a11y/no-static-element-interactions": "error",

      // `any` erases the type safety the rest of the config is enforcing.
      "@typescript-eslint/no-explicit-any": "error",

      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always", { null: "ignore" }],
    },
  },

  {
    files: ["**/*.test.{ts,tsx}", "src/test/**"],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      // Test tables legitimately ignore positional args.
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "i18next/no-literal-string": "off",
    },
  },

  {
    files: ["public/sw.js"],
    languageOptions: { globals: { ...globals.serviceworker, ...globals.browser } },
  }
);
