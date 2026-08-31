import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { zipDist } from "./dist.ts";
import { resolve } from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
	base: "",
	build: {
		modulePreload: {
			polyfill: false,
		},
		assetsDir: ".",
		// rolldownOptions: {
			// output: {
				// entryFileNames: "g.js",
			// },
		// },
		minify: "terser",
		terserOptions: {
			ecma: 2020,
			mangle: {
				properties: true,
				module: true,
				toplevel: true,
			},
			module: true,
			toplevel: true,
			compress: {
				passes: 3,
				unsafe: true,
				unsafe_math: true,
				unsafe_arrows: true,
				unsafe_methods: true,
				toplevel: true,
			},
		},
	},
	plugins: [
		glsl({minify: true}),
		viteSingleFile(),
		zipDist(),
		{
			name: "strip-html",

			transformIndexHtml(html) {
				return html
					.replaceAll(" crossorigin", "")
					.replaceAll(/^\s*/gm, "")
					.replaceAll("\n", "")
					;
			}
		},
		{
			name: "generate-binary",

			buildStart() {
				this.addWatchFile(resolve("public/b"));
			},

			handleHotUpdate({ file, server }) {
				if (file === resolve("public/b")) {
					server.ws.send({type: "full-reload"})
				}
			}
		},
	],
});
