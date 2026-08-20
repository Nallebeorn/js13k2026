import { gl } from "./renderingGlobals.ts";
import { GL_ARRAY_BUFFER, GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1, GL_COLOR_BUFFER_BIT, GL_DEPTH_ATTACHMENT, GL_DEPTH_BUFFER_BIT, GL_DEPTH_COMPONENT, GL_DEPTH_COMPONENT24, GL_DEPTH_TEST, GL_FLOAT, GL_FRAMEBUFFER, GL_RGBA, GL_STATIC_DRAW, GL_TEXTURE0, GL_TEXTURE1, GL_TEXTURE_2D, GL_TRIANGLES, GL_UNSIGNED_BYTE, GL_UNSIGNED_INT } from "./glConstants.ts";
import { IDENTITY, projectPerspective } from "../core/math.ts";
import { delta } from "../core/time.ts";
import { DEBUG } from "../debug.ts";
import { objectShader, objectShaderInfo, postProcessShader, postProcessShaderInfo } from "./shaders/shaders.ts";
import { isKeyHeld, mouseDeltaX } from "../input/input.ts";
import { deserializeObjects } from "../gamedata/binreader.ts";
import { COLOR_BLACK, colors, type Color } from "../gamedata/colors.ts";
import { obj_cubeStack, obj_oldScene, obj_oldScene_box1Slot, obj_oldScene_box2Slot, obj_oldScene_box3Slot, obj_oldScene_clubSlot, type SceneHandle } from "../gamedata/objects.gen.ts";

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

// * Set up vertex array buffer
export interface ObjectInfo {
	offset: number,
	size: number,
}

export function addVertexData(vertices: number[]): ObjectInfo {
	return {
		size: vertices.length,
		offset: vertexData.push(...vertices) - vertices.length,
	}
};

const arrayBuffer = gl.createBuffer();
gl.bindBuffer(GL_ARRAY_BUFFER, arrayBuffer);
const vertexData: number[] = [];

const objectsBank = deserializeObjects(await (await fetch("./g.bin")).arrayBuffer());

gl.bufferData(
		GL_ARRAY_BUFFER,
		new Float32Array(vertexData),
		GL_STATIC_DRAW
	);
gl.vertexAttribPointer(0, 4, GL_FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

// * Set up postprocess shader
gl.useProgram(postProcessShader);

gl.uniform1i(postProcessShaderInfo.colorTextureUniform, 0);
gl.uniform1i(postProcessShaderInfo.surfaceIndexTextureUniform, 1);

gl.activeTexture(GL_TEXTURE0);
gl.bindTexture(GL_TEXTURE_2D, colorTexture);
gl.activeTexture(GL_TEXTURE1)
gl.bindTexture(GL_TEXTURE_2D, surfaceIndexTexture);

// * Set up configuration
gl.clearColor(1, 1, 1, 1);
gl.enable(GL_DEPTH_TEST);

const fov = 2.4; // ≈ TAU/8 radians = 45°
const aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
const projectionMatrix = new DOMMatrix(projectPerspective(fov, aspect, 0.1));
let cameraTransform = IDENTITY;

// * Render API
function drawObject(object: ObjectInfo, color: Color, transform: DOMMatrix) {
	gl.uniformMatrix4fv(
		objectShaderInfo.objectToWorldUniform,
		false,
		transform.toFloat32Array(),
	);
	gl.uniform4fv(objectShaderInfo.objectColor, colors[color]!);
	gl.uniform1f(objectShaderInfo.objectIndexUniform, objectIndex)

	gl.drawArrays(GL_TRIANGLES, object.offset / 4, object.size / 4);
	};

function drawScene(scene: SceneHandle, slotTransforms: Record<number, DOMMatrix>) {
	let transformSlotIndex = 0;
	for (const command of objectsBank[scene]!) {
		color = command.color ?? color;
		if (command.incrementSurfaceIndex) {
			objectIndex++;
		}

		if (command.pushTransform) {
			transformStack.push(
				transformStack.at(-1)!
					.multiply(command.pushTransform)
					.multiply(slotTransforms[transformSlotIndex++] ?? IDENTITY)
			);
		}

		if (command.drawShape) {
			drawObject(
				command.drawShape,
				color,
				transformStack.at(-1)!
			)
		}

		if (command.popTransform) {
		 transformStack.pop();
		}
	};
	objectIndex++;
}

// * Frame state
let objectIndex!: number;
let color!: Color;
let transformStack!: DOMMatrix[];

// * Draw scene
let rotation = 0;

export function setupFrame() {
	gl.useProgram(objectShader)
	gl.bindFramebuffer(GL_FRAMEBUFFER, framebuffer);
	gl.uniformMatrix4fv(
  	objectShaderInfo.worldToClipUniform,
  	false,
		projectionMatrix.multiply(cameraTransform.inverse()).toFloat32Array(),
	);
	gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	transformStack = [IDENTITY];
	objectIndex = 0;
	color = 0;
}

export function finishFrame() {
	// * Draw post processing (and blit to canvas)
	gl.bindFramebuffer(GL_FRAMEBUFFER, null);
	gl.useProgram(postProcessShader);
	gl.drawArrays(GL_TRIANGLES, 0, 3);
}

export function renderLoop() {
	const slotTransforms: Record<number, DOMMatrix> = {
		[obj_oldScene_box1Slot]: IDENTITY.rotate(rotation / 3, rotation, rotation / 2),
		[obj_oldScene_box2Slot]: IDENTITY.rotate(rotation / 2, rotation * .5, rotation / 3),
		[obj_oldScene_box3Slot]: IDENTITY.rotate(rotation, rotation / 3, rotation / 3),
		[obj_oldScene_clubSlot]: IDENTITY.rotate(rotation / 3, rotation / 2, rotation),
	};


	for (const scene of [obj_cubeStack, obj_oldScene] satisfies SceneHandle[]) {
		drawScene(scene, slotTransforms);
	}


	// * Process
	rotation += 180 * delta;
	const speed = 10 * delta;
	const rotationSpeed = 180 * delta;
	const [movex, movey] = [isKeyHeld("KeyD") - isKeyHeld("KeyA"), isKeyHeld("KeyW") - isKeyHeld("KeyS")]
	const moveYaw = mouseDeltaX * .1;
	cameraTransform = cameraTransform.rotate(0, -moveYaw * rotationSpeed).translate(movex * speed, 0, -movey * speed);
}
