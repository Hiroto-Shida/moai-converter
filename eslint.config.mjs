// 参考
// see: https://r4ai.dev/posts/migrate-eslint-to-v9/
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
  {
    ignores: [".astro/**/*", "dist/**/*", "node_modules/**/*"],
  },
  eslintConfigPrettier,
);
