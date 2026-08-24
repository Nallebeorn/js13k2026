import { delta } from "../core/time.ts";
import { obj_unicorn } from "../gamedata/objects.gen.ts";
import { isKeyHeld, mouseDeltaX, wasKeyJustPressed } from "../input/input.ts";
import { cameraTransform, drawScene, ROOT_SLOT, updateCameraTransform } from "../rendering/renderer.ts";
import { processPlayer } from "./player.ts";

export function processFrame() {
	processPlayer();

	if (wasKeyJustPressed("Space")) {
		console.log("space pressed!");
	}

	drawScene(obj_unicorn, {
		[ROOT_SLOT]: {
			translation: [0, 0, -12],
		},
	});
}
