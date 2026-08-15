import { gl } from "./renderingGlobals.ts";
import { GL_ARRAY_BUFFER, GL_BACK, GL_COLOR_BUFFER_BIT, GL_CULL_FACE, GL_DEPTH_TEST, GL_FLOAT, GL_FRONT, GL_FRONT_AND_BACK, GL_STATIC_DRAW, GL_TRIANGLE_STRIP, GL_TRIANGLES } from "./glConstants.ts";
import { projectPerspective, TAU, transform } from "../core/math.ts";
import { delta } from "../core/time.ts";
import { objectShader, objectShaderInfo } from "./objectShader/objectShader.ts";
import { createCube } from "./shapes.ts";
import { DEBUG } from "../debug.ts";

if (DEBUG && !gl) {
	console.error("No WebGL context!");
}

const arrayBuffer = gl.createBuffer();
gl.bindBuffer(GL_ARRAY_BUFFER, arrayBuffer);
gl.useProgram(objectShader)
gl.enable(GL_DEPTH_TEST);

const vertexData: number[] = [];

const addVertexData = (vertices: number[]): ObjectInfo => ({
		size: vertices.length,
		offset: vertexData.push(...vertices) - vertices.length,
});

interface ObjectInfo {
	offset: number,
	size: number,
}

const drawObject = (object: ObjectInfo) => {
	gl.drawArrays(GL_TRIANGLES, object.offset / 4, object.size / 4);
};


const cubeObject = addVertexData(createCube());

gl.bufferData(
		GL_ARRAY_BUFFER,
		new Float32Array(vertexData),
		GL_STATIC_DRAW
	);
	gl.vertexAttribPointer(objectShaderInfo.p, 4, GL_FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(objectShaderInfo.p);

gl.clearColor(1, 1, 1, 1);

const fov = 2.4; // ≈ TAU/8 radians = 45°
const aspect = 4/3;
const projectionMatrix = projectPerspective(fov, aspect, 0.1);

let rotation = 0;

export function render() {
	const objectToViewMatrix = transform(0, 0, -6, 0, 1, 0, rotation);

	rotation += 180 * delta;

	gl.uniformMatrix4fv(
  objectShaderInfo.v2c,
  false,
  projectionMatrix,
	);
	gl.uniformMatrix4fv(
  objectShaderInfo.o2v,
  false,
  objectToViewMatrix.toFloat32Array(),
	);

	gl.clear(GL_COLOR_BUFFER_BIT);
	drawObject(cubeObject);
}
