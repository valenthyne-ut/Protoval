import eslint from "@eslint/js";
import tslint from "typescript-eslint";
import vuelint from "eslint-plugin-vue";
import globals from "globals";

// Setting this up was a pain in my ASS.

export default tslint.config(
	eslint.configs.recommended,
	...tslint.configs.recommendedTypeChecked,
	...vuelint.configs["flat/recommended"],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2024
			},
			parserOptions: {
				parser: tslint.parser,
				project: [
					"workspaces/app/tsconfig.json",
					"workspaces/dashboard/tsconfig.json",
					"workspaces/dashboard/tsconfig.app.json",
					"workspaces/dashboard/tsconfig.node.json"
				],
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: [ ".vue" ],
				sourceType: "module"
			}
		}
	},
	{
		rules: {
			"indent": [ "error", "tab" ],
			"semi": [ "error", "always" ],
			"quotes": [ "warn", "double" ]
		}
	},
	{
		files: [ "**/*.vue" ],
		rules: {
			"indent": "off",
			"vue/script-indent": [ "error", "tab", { "baseIndent": 1 } ],
			"vue/html-indent": [ "error", "tab" ]
		}
	},
	{
		files: [ "workspaces/dashboard/src/**/*.ts", "**/*.js", "**/*.mjs" ],
		...tslint.configs.disableTypeChecked	
	},
	{
		ignores: [ "**/dist", "eslint.config.mjs" ]
	}
)
