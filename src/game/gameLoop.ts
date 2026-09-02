import { IDENTITY } from "../core/math.ts";
import { COLOR_RAINBOW } from "../gamedata/colors.ts";
import { obj_pillar10, obj_pillar5, obj_unicorn } from "../gamedata/objects.gen.ts";
import { drawMesh, drawObject, rainbowMesh, ROOT_SLOT } from "../rendering/renderer.ts";
import { processPlayer } from "./player.ts";

export function processFrame() {
	processPlayer();

	drawObject(obj_pillar10, {
		[ROOT_SLOT]: {
			translation: [-5, 1, -12],
		},
	});
	drawObject(obj_pillar5, {
		[ROOT_SLOT]: {
			translation: [-10, 1, -12],
		},
	});

	drawMesh(rainbowMesh, COLOR_RAINBOW, IDENTITY.translate(5, 0, -12), 20, 1);
}
