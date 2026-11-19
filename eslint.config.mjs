import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierRecommended from "eslint-plugin-prettier/recommended";

// eslint-config-next 16 ships native flat configs, so no FlatCompat wrapper.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Runs Prettier as a lint rule ("prettier/prettier": "error") and turns off
  // formatting rules that conflict with it.
  prettierRecommended,
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
