import { delta, time } from "../core/time.ts";
import { obj_cubeStack, obj_cubeStack_boxSlot, obj_cubeStack_pillySlot, obj_oldScene, obj_oldScene_box1Slot, obj_oldScene_box2Slot, obj_oldScene_box3Slot, obj_oldScene_clubSlot, obj_unicorn, obj_unicorn_rootSlot, type SceneHandle } from "../gamedata/objects.gen.ts";
import { isKeyHeld, mouseDeltaX } from "../input/input.ts";
import { cameraTransform, drawScene, updateCameraTransform } from "../rendering/renderer.ts";

export function processFrame() {
	const rotation = 180 * time;

	// drawScene(obj_oldScene, {
	// [obj_oldScene_box1Slot]: {euler: [rotation / 3, rotation, rotation / 2]},
	// [obj_oldScene_box2Slot]: {euler: [rotation / 2, rotation * .5, rotation / 3]},
	// [obj_oldScene_box3Slot]: {euler: [rotation, rotation / 3, rotation / 3]},
	// [obj_oldScene_clubSlot]: {euler: [rotation / 3, rotation / 2, rotation]},
	// });
	//
	// drawScene(obj_cubeStack, {
	// [obj_cubeStack_boxSlot]: { euler: [rotation, rotation / 3, rotation / 3] },
	// [obj_cubeStack_pillySlot]: { translation: [0, 0.5 * (Math.sin(time * 20) * 0.5 + 0.5), 0] },
	// });

	drawScene(obj_unicorn, { [obj_unicorn_rootSlot]: { translation: [0, 0, -6], euler: [0, 90, 0] } });

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
