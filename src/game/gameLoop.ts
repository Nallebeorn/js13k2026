import { delta, time } from "../core/time.ts";
import { obj_unicorn, obj_unicorn_headSlot, obj_unicorn_neckSlot, obj_unicorn_tailSlot } from "../gamedata/objects.gen.ts";
import { isKeyHeld, mouseDeltaX, wasKeyJustPressed } from "../input/input.ts";
import { cameraTransform, drawScene, ROOT_SLOT, updateCameraTransform } from "../rendering/renderer.ts";
import { gameObjects } from "./gameObject.ts";
import { Player } from "./player.ts";

gameObjects.push(Player())

export function processFrame() {
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

	gameObjects.map(obj => obj.process());

	if (wasKeyJustPressed("Space")) {
		console.log("space pressed!");
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
