import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    ignores: [
      "**/*.test.*",  // Ignore all .test.js/.ts/.jsx/.tsx/etc.
      "build/**",     // Ignore everything inside the build/ folder
      "database_actual/",
    ],
  },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
  {
    rules: {
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  }
]);
