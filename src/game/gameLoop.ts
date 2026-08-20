import { IDENTITY } from "../core/math.ts";
import { delta, time } from "../core/time.ts";
import { obj_cubeStack, obj_oldScene, obj_oldScene_box1Slot, obj_oldScene_box2Slot, obj_oldScene_box3Slot, obj_oldScene_clubSlot, type SceneHandle } from "../gamedata/objects.gen.ts";
import { isKeyHeld, mouseDeltaX } from "../input/input.ts";
import { cameraTransform, drawScene, updateCameraTransform } from "../rendering/renderer.ts";

export function processFrame() {
	const rotation = 180 * time;

	const slotTransforms: Record<number, DOMMatrix> = {
		[obj_oldScene_box1Slot]: IDENTITY.rotate(rotation / 3, rotation, rotation / 2),
		[obj_oldScene_box2Slot]: IDENTITY.rotate(rotation / 2, rotation * .5, rotation / 3),
		[obj_oldScene_box3Slot]: IDENTITY.rotate(rotation, rotation / 3, rotation / 3),
		[obj_oldScene_clubSlot]: IDENTITY.rotate(rotation / 3, rotation / 2, rotation),
	};


	for (const scene of [obj_cubeStack, obj_oldScene] satisfies SceneHandle[]) {
		drawScene(scene, slotTransforms);
	}

	const speed = 10 * delta;
	const rotationSpeed = 180 * delta;
	const movex = isKeyHeld("KeyD") - isKeyHeld("KeyA");
	const movey = isKeyHeld("KeyW") - isKeyHeld("KeyS");
	const moveYaw = mouseDeltaX * .1;
	updateCameraTransform(
		cameraTransform
			.rotate(0, -moveYaw * rotationSpeed)
			.translate(movex * speed, 0, -movey * speed)
	);
}
