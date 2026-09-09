import { IDENTITY } from "../core/math.ts";
import { COLOR_RAINBOW } from "../gamedata/colors.ts";
import { drawMesh } from "../rendering/renderer.ts";
import { processPlayer } from "./player.ts";
import { rainbowMesh } from "../rendering/vertexData.ts";
import { processNpcs } from "./npcs.ts";
import { processRainbowShards } from "./rainbowShards.ts";
import { processScreenTransition } from "../rendering/screenTransition.ts";
import { processBalloons } from "./balloon.ts";

export function processFrame() {
	processScreenTransition();
	processNpcs();
	processRainbowShards();
	processBalloons();
	processPlayer();

	/* drawMesh(
		rainbowMesh,
		COLOR_RAINBOW,
		IDENTITY.translate(5, 0, -12).rotate(-90, 90, 0),
		7,
		1,
	) */;
}
