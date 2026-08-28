import { obj_unicorn } from "../gamedata/objects.gen.ts";
import { drawScene, ROOT_SLOT } from "../rendering/renderer.ts";
import { processPlayer } from "./player.ts";

export function processFrame() {
	processPlayer();

	drawScene(obj_unicorn, {
		[ROOT_SLOT]: {
			translation: [0, 0, -12],
		},
	});
}
