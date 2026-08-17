import { gl } from "./renderingGlobals.ts";
import { GL_ARRAY_BUFFER, GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1, GL_COLOR_BUFFER_BIT, GL_CULL_FACE, GL_DEPTH_ATTACHMENT, GL_DEPTH_BUFFER_BIT, GL_DEPTH_COMPONENT, GL_DEPTH_COMPONENT24, GL_DEPTH_TEST, GL_DRAW_FRAMEBUFFER, GL_FLOAT, GL_FRAMEBUFFER, GL_INT, GL_NEAREST, GL_R32F, GL_R32I, GL_R32UI, GL_R8, GL_READ_FRAMEBUFFER, GL_RED, GL_RED_INTEGER, GL_RGB, GL_RGBA, GL_STATIC_DRAW, GL_TEXTURE0, GL_TEXTURE1, GL_TEXTURE_2D, GL_TRIANGLES, GL_UNSIGNED_BYTE, GL_UNSIGNED_INT } from "./glConstants.ts";
import { IDENTITY, projectPerspective, type Vec4 } from "../core/math.ts";
import { delta } from "../core/time.ts";
import { createPill, createBox } from "./shapes.ts";
import { DEBUG } from "../debug.ts";
import { objectShader, objectShaderInfo, postProcessShader, postProcessShaderInfo } from "./shaders/shaders.ts";
import { getMouseDeltaX, getMouseDeltaY, isKeyHeld } from "../input/input.ts";

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

const cubeObject = addVertexData(createBox(0.2, 0.2, 1.0, 0.5, 0.5));
const capsuleObject = addVertexData(createPill(0.5, 0.2, 1));

gl.bufferData(
		GL_ARRAY_BUFFER,
		new Float32Array(vertexData),
		GL_STATIC_DRAW
	);
	gl.vertexAttribPointer(0, 4, GL_FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(0);

// * Set up configuration
gl.clearColor(1, 1, 1, 1);
gl.enable(GL_DEPTH_TEST);

const fov = 2.4; // ≈ TAU/8 radians = 45°
const aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
const projectionMatrix = new DOMMatrix(projectPerspective(fov, aspect, 0.1));
let cameraTransform = IDENTITY;

// * Draw scene
let rotation = 0;

export function render() {
	// * Setup
	let objectIndex = 0;
	function drawObject(object: ObjectInfo, color: Vec4, transform: DOMMatrix) {
		gl.uniformMatrix4fv(
  		objectShaderInfo.objectToWorldUniform,
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
  	objectShaderInfo.worldToClipUniform,
  	false,
		projectionMatrix.multiply(cameraTransform.inverse()).toFloat32Array(),
	);
	gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	// * Process
	rotation += 180 * delta;
	const speed = 10 * delta;
	const rotationSpeed = 180 * delta;
	const [movex, movey] = [isKeyHeld("KeyD") - isKeyHeld("KeyA"), isKeyHeld("KeyW") - isKeyHeld("KeyS")]
	// const moveYaw = isKeyHeld("ArrowRight") - isKeyHeld("ArrowLeft");
	const moveYaw = getMouseDeltaX() * .1;
	cameraTransform = cameraTransform.rotate(0, -moveYaw * rotationSpeed).translate(movex * speed, 0, -movey * speed);

	// * Draw objects
	drawObject(cubeObject, [1, 0.8, 0.9, 1], IDENTITY
		.translate(0, 0, -6)
		.rotate(rotation / 3, rotation, rotation / 2)
	);
	drawObject(cubeObject, [0.5, 0.8, 0.3, 1], IDENTITY
		.translate(-0.7, -.3, -5)
		.rotate(-rotation / 2, rotation * .5, -rotation / 3)
	);
	drawObject(cubeObject, [0.6, 0.2, 0.9, 1], IDENTITY
		.translate(0.8, 0.4, -4.5)
		.rotate(rotation, rotation / 3, -rotation / 3)
	);

	drawObject(capsuleObject, [1, 1, 1, 1], IDENTITY
		.translate(0, 0, -4)
		.rotate(rotation / 3, rotation / 2, rotation)
	);

	// * Draw post processing (and blit to canvas)
	gl.bindFramebuffer(GL_FRAMEBUFFER, null);
	gl.useProgram(postProcessShader);
	gl.drawArrays(GL_TRIANGLES, 0, 3);
}
