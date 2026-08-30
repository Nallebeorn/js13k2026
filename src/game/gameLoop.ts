import { obj_unicorn } from "../gamedata/objects.gen.ts";
import { drawObject, ROOT_SLOT } from "../rendering/renderer.ts";
import { processPlayer } from "./player.ts";

export function processFrame() {
	processPlayer();

	drawObject(obj_unicorn, {
		[ROOT_SLOT]: {
			translation: [-5, 0, -12],
		},
	});
}
