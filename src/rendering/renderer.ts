import { gl } from "./renderingGlobals.ts";
import { GL_ARRAY_BUFFER, GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1, GL_COLOR_BUFFER_BIT, GL_DEPTH_ATTACHMENT, GL_DEPTH_BUFFER_BIT, GL_DEPTH_COMPONENT, GL_DEPTH_COMPONENT24, GL_DEPTH_TEST, GL_DRAW_FRAMEBUFFER, GL_FLOAT, GL_FRAMEBUFFER, GL_NEAREST, GL_R32F, GL_R8, GL_READ_FRAMEBUFFER, GL_RED, GL_RGB, GL_RGBA, GL_STATIC_DRAW, GL_TEXTURE0, GL_TEXTURE1, GL_TEXTURE_2D, GL_TRIANGLES, GL_UNSIGNED_BYTE, GL_UNSIGNED_INT } from "./glConstants.ts";
import { projectPerspective } from "../core/math.ts";
import { delta } from "../core/time.ts";
import { createCube } from "./shapes.ts";
import { DEBUG } from "../debug.ts";
import { objectShader, objectShaderInfo, postProcessShader, postProcessShaderInfo } from "./shaders/shaders.ts";

if (DEBUG && !gl) {
	console.error("No WebGL context!");
}


// * Set up render targets
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(GL_FRAMEBUFFER, framebuffer);

const createRenderTexture = (attachment: GLenum, internalFormat: GLenum, format: GLenum, type: GLenum) => {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(GL_TEXTURE_2D, 0, internalFormat, CANVAS_WIDTH, CANVAS_HEIGHT, 0, format, type, null);
	gl.texParameteri(GL_TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(GL_TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.framebufferTexture2D(GL_FRAMEBUFFER, attachment, GL_TEXTURE_2D, texture, 0);
	return texture;
}

const colorTexture = createRenderTexture(GL_COLOR_ATTACHMENT0, GL_RGBA, GL_RGBA, GL_UNSIGNED_BYTE);
const surfaceIndexTexture = createRenderTexture(GL_COLOR_ATTACHMENT1, GL_R8, GL_RED, GL_UNSIGNED_BYTE);
const depthTexture = createRenderTexture(GL_DEPTH_ATTACHMENT, GL_DEPTH_COMPONENT24, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT);
gl.drawBuffers([GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1]);

if (DEBUG) {
	const status = gl.checkFramebufferStatus(GL_FRAMEBUFFER);

	if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("Framebuffer incomplete:", "0x" + status.toString(16));
	}
}

// * Set up postprocess shader
gl.useProgram(postProcessShader);
gl.uniform1i(postProcessShaderInfo.colorTextureUniform, 0);
gl.uniform1i(postProcessShaderInfo.surfaceIndexTextureUniform, 1);

gl.activeTexture(GL_TEXTURE0);
gl.bindTexture(GL_TEXTURE_2D, colorTexture);
gl.activeTexture(GL_TEXTURE1)
gl.bindTexture(GL_TEXTURE_2D, surfaceIndexTexture);

// * Prepare array buffers
const arrayBuffer = gl.createBuffer();
gl.bindBuffer(GL_ARRAY_BUFFER, arrayBuffer);
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


// * Set up configuration
gl.clearColor(1, 1, 1, 1);
gl.enable(GL_DEPTH_TEST);

const fov = 2.4; // ≈ TAU/8 radians = 45°
const aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
const projectionMatrix = projectPerspective(fov, aspect, 0.1);

// * Draw scene
let rotation = 0;

export function render() {
	gl.useProgram(objectShader)
	gl.bindFramebuffer(GL_DRAW_FRAMEBUFFER, framebuffer);

	const objectToViewMatrix = new DOMMatrix()
		.translate(0, 0, -6)
		.rotate(rotation / 3, rotation, 0);

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

	gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	drawObject(cubeObject);

	gl.bindFramebuffer(GL_DRAW_FRAMEBUFFER, null);
	gl.blitFramebuffer(
		0, 0, CANVAS_WIDTH, CANVAS_HEIGHT,
		0, 0, CANVAS_WIDTH, CANVAS_HEIGHT,
		GL_COLOR_BUFFER_BIT, GL_NEAREST
	);

	gl.useProgram(postProcessShader);
	gl.drawArrays(GL_TRIANGLES, 0, 3);
}
