import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import cypress from "eslint-plugin-cypress";
import ngrx from "@ngrx/eslint-plugin";

export default tseslint.config(
  {
    ignores: ["projects/**/*", "**/*.cy.js", "dist/**/*", "out-tsc/**/*"],
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "no-console": "warn",

      "no-restricted-imports": [
        "warn",
        {
          patterns: ["..*"],
        },
      ],

      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],

      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],

      "@angular-eslint/prefer-inject": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@angular-eslint/no-empty-lifecycle-method": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    files: ["**/*.spec.ts"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "prettier/prettier": [
        "error",
        {
          parser: "angular",
          endOfLine: "auto",
        },
      ],

      "@angular-eslint/template/click-events-have-key-events": "warn",
      "@angular-eslint/template/interactive-supports-focus": "warn",
      "@angular-eslint/template/label-has-associated-control": "warn",
    },
  },
  {
    files: ["**/*.cy.ts"],
    plugins: {
      cypress,
    },
    languageOptions: {
      globals: {
        cy: "readonly",
        Cypress: "readonly",
        before: "readonly",
        beforeEach: "readonly",
        after: "readonly",
        afterEach: "readonly",
        describe: "readonly",
        it: "readonly",
      },
    },
    rules: {
      "cypress/no-assigning-return-values": "error",
      "cypress/no-unnecessary-waiting": "error",
      "cypress/assertion-before-screenshot": "warn",
      "cypress/no-force": "warn",
      "cypress/no-async-tests": "error",
      "cypress/no-pause": "error",
    },
  },
  {
    files: ["**/*.actions.ts", "**/*.reducer.ts", "**/*.selectors.ts"],
    extends: [...ngrx.configs.store],
    rules: {
      "@ngrx/good-action-hygiene": "error",
      "@ngrx/on-function-explicit-return-type": "warn",
    },
  },
  prettierRecommended,
);
