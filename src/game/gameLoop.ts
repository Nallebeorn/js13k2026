import { obj_unicorn } from "../gamedata/objects.gen.ts";
import { wasKeyJustPressed } from "../input/input.ts";
import { drawScene, ROOT_SLOT } from "../rendering/renderer.ts";
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
