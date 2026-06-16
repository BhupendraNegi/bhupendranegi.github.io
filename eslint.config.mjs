// ESLint flat config — lints the site's vanilla browser JavaScript.
// The runtime JS is written as classic IIFEs (no bundler, no modules) and
// relies on CDN globals (GSAP, Lucide, Google Analytics). Config files in the
// repo root are Node ESM and are linted with Node globals instead.
import js from "@eslint/js";
import globals from "globals";

export default [
  // Ignore generated output and vendored code.
  {
    ignores: [
      "_site/**",
      "node_modules/**",
      "vendor/**",
      ".jekyll-cache/**",
      "assets/css/version-3.css",
    ],
  },

  // Browser runtime scripts.
  {
    files: ["assets/js/**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        ...globals.browser,
        // CDN libraries loaded before these scripts.
        gsap: "readonly",
        ScrollTrigger: "readonly",
        SplitText: "readonly",
        lucide: "readonly",
        gtag: "readonly",
        Disqus: "readonly",
        DISQUS: "writable",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      eqeqeq: ["warn", "smart"],
      "no-var": "off", // existing code intentionally targets older browsers
    },
  },

  // Repo-root config files (this file, etc.) run under Node as ESM.
  {
    files: ["*.mjs", "*.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
];
