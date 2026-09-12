import { IDENTITY } from "../core/math.ts";
import { COLOR_RAINBOW } from "../gamedata/colors.ts";
import { processPlayer } from "./player.ts";
import { processNpcs } from "./npcs.ts";
import { processRainbowShards } from "./rainbowShards.ts";
import { processScreenTransition } from "../rendering/screenTransition.ts";
import { processBalloons } from "./balloon.ts";
import { processSpeedrunTimer } from "../core/speedrunTimer.ts";

export function processFrame() {
	processScreenTransition();
	processNpcs();
	processRainbowShards();
	processBalloons();
	processPlayer();
	processSpeedrunTimer();
}
