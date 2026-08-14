import { defineConfig } from "vite";
import htmlMinifier from 'vite-plugin-html-minifier';
import glsl from 'vite-plugin-glsl';
import { zipDist } from "./dist.ts";

export default defineConfig({
	build: {
		modulePreload: {
			polyfill: false,
		},
		assetsDir: ".",
		rolldownOptions: {
			output: {
				entryFileNames: "g.js",
			}
		},
		minify: "terser",
		terserOptions: {
			ecma: 2020,
			mangle: {
				properties: true,
				module: true,
				toplevel: true
			},
			module: true,
			toplevel: true,
			compress: {
				unsafe: true,
				unsafe_math: true,
			}
		},
	},
	plugins: [
		htmlMinifier({
			minify: true,
		}),
		glsl({
			minify: true,
		}),
		zipDist(),
	]
});
