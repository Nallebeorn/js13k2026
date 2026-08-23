import { delta } from "../core/time.ts";
import { isKeyHeld, mouseDeltaX, wasKeyJustPressed } from "../input/input.ts";
import { cameraTransform, updateCameraTransform } from "../rendering/renderer.ts";
import { processPlayer } from "./player.ts";

export function processFrame() {
	processPlayer();

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
