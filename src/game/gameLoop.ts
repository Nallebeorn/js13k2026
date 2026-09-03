import { IDENTITY } from "../core/math.ts";
import { COLOR_RAINBOW } from "../gamedata/colors.ts";
import { drawMesh, rainbowMesh } from "../rendering/renderer.ts";
import { drawLevel } from "./level.ts";
import { processPlayer } from "./player.ts";

export function processFrame() {
	drawLevel();
	processPlayer();

	drawMesh(rainbowMesh, COLOR_RAINBOW, IDENTITY.translate(5, 0, -12), 20, 1);
}
