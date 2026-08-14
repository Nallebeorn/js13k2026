import vertexShaderSource from "./object.vert.glsl";
import fragmentShaderSource from "./object.frag.glsl";
import { createShaderProgram } from "../shaders.ts";
import { gl } from "../renderingGlobals.ts";

export const objectShader = createShaderProgram(vertexShaderSource, fragmentShaderSource);

export const objectShaderInfo = {
	p: 0,
	o2v: gl.getUniformLocation(objectShader, "o2v"),
	v2c: gl.getUniformLocation(objectShader, "v2c"),
}
