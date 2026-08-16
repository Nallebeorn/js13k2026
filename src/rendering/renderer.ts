import { gl } from "./renderingGlobals.ts";
import { GL_ARRAY_BUFFER, GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1, GL_COLOR_BUFFER_BIT, GL_CULL_FACE, GL_DEPTH_ATTACHMENT, GL_DEPTH_BUFFER_BIT, GL_DEPTH_COMPONENT, GL_DEPTH_COMPONENT24, GL_DEPTH_TEST, GL_DRAW_FRAMEBUFFER, GL_FLOAT, GL_FRAMEBUFFER, GL_INT, GL_NEAREST, GL_R32F, GL_R32I, GL_R32UI, GL_R8, GL_READ_FRAMEBUFFER, GL_RED, GL_RED_INTEGER, GL_RGB, GL_RGBA, GL_STATIC_DRAW, GL_TEXTURE0, GL_TEXTURE1, GL_TEXTURE_2D, GL_TRIANGLES, GL_UNSIGNED_BYTE, GL_UNSIGNED_INT } from "./glConstants.ts";
import { IDENTITY, projectPerspective, type Vec4 } from "../core/math.ts";
import { delta } from "../core/time.ts";
import { createCapsule, createCube } from "./shapes.ts";
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
	gl.framebufferTexture2D(GL_FRAMEBUFFER, attachment, GL_TEXTURE_2D, texture, 0);
	return texture;
}

const colorTexture = createRenderTexture(GL_COLOR_ATTACHMENT0, GL_RGBA, GL_RGBA, GL_UNSIGNED_BYTE);
const surfaceIndexTexture = createRenderTexture(GL_COLOR_ATTACHMENT1, GL_RGBA, GL_RGBA, GL_UNSIGNED_BYTE);
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
interface ObjectInfo {
	offset: number,
	size: number,
}

function addVertexData(vertices: number[]): ObjectInfo {
	return {
		size: vertices.length,
		offset: vertexData.push(...vertices) - vertices.length,
	}
};

const arrayBuffer = gl.createBuffer();
gl.bindBuffer(GL_ARRAY_BUFFER, arrayBuffer);
const vertexData: number[] = [];

const cubeObject = addVertexData(createCube());
const capsuleObject = addVertexData(createCapsule(0.5, 1.0));

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
	// * Draw objects
	let objectIndex = 0;
	function drawObject(object: ObjectInfo, color: Vec4, transform: DOMMatrix) {
		gl.uniformMatrix4fv(
  		objectShaderInfo.objectToViewUniform,
  		false,
  		transform.toFloat32Array(),
		);
		gl.uniform4fv(objectShaderInfo.objectColor, color);
		gl.uniform1f(objectShaderInfo.objectIndexUniform, objectIndex++)

		gl.drawArrays(GL_TRIANGLES, object.offset / 4, object.size / 4);
	};

	gl.useProgram(objectShader)
	gl.bindFramebuffer(GL_FRAMEBUFFER, framebuffer);
	gl.uniformMatrix4fv(
  	objectShaderInfo.viewToClipUniform,
  	false,
  	projectionMatrix,
	);
	gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	rotation += 180 * delta;
	// drawObject(cubeObject, [1, 0.8, 0.9, 1], IDENTITY
		// .translate(0, 0, -6)
		// .rotate(rotation / 3, rotation, rotation / 2)
	// );
	// drawObject(cubeObject, [0.5, 0.8, 0.3, 1], IDENTITY
		// .translate(-0.7, -.3, -5)
		// .rotate(-rotation / 2, rotation * .5, -rotation / 3)
	// );
	// drawObject(cubeObject, [0.6, 0.2, 0.9, 1], IDENTITY
		// .translate(0.8, 0.4, -4.5)
		// .rotate(rotation, rotation / 3, -rotation / 3)
	// );
	//
	drawObject(capsuleObject, [1, 1, 1, 1], IDENTITY
		.translate(0, 0, -6)
		.rotate(rotation / 3, rotation / 2, rotation)
	);

	// * Draw post processing (and blit to canvas)
	gl.bindFramebuffer(GL_FRAMEBUFFER, null);
	gl.useProgram(postProcessShader);
	gl.drawArrays(GL_TRIANGLES, 0, 3);
}
