import { DEBUG } from "../debug.ts";

export const gl = canvas.getContext("webgl2", { antialias: false })!;

if (DEBUG && !gl) {
	console.error("No WebGL context!");
}
