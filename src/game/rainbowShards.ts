import { IDENTITY, length, sub, type Vec3 } from "../core/math.ts";
import { currentTime } from "../core/time.ts";
import { DEBUG } from "../debug.ts";
import { COLOR_GREEN, COLOR_YELLOW, unlockColor, type Color } from "../gamedata/colors.ts";
import { wasKeyJustPressed } from "../input/input.ts";
import type { KeyCode } from "../input/keycode.ts";
import { drawMesh } from "../rendering/renderer.ts";
import { doScreenWipe, transitionProgress } from "../rendering/screenTransition.ts";
import { rainbowMesh } from "../rendering/vertexData.ts";
import { getPlayerPos } from "./player.ts";

export const shards: [pos: Vec3, color: Color][] = [
	[[-30, 21, -16], COLOR_GREEN],
	[[30, 21, 120], COLOR_YELLOW],
]

export let shardsCollected = 0;

export function processRainbowShards() {
	for (let i = shards.length - 1; i >= 0; i--) {
		drawMesh(
			rainbowMesh,
			shards[i]![1] + 10,
			IDENTITY
				.translate(...shards[i]![0])
				.rotate(-90, currentTime * 360, 0)
				.translate(0, 3, Math.sin(currentTime * 3)),
			7,
			1,
		);

		if (
			(length(sub(shards[i]![0], getPlayerPos())) < 3 ||
				(DEBUG && wasKeyJustPressed(`Digit${i + 1}` as KeyCode))) &&
			!transitionProgress
		) {
			doScreenWipe(shards[i]![1]+10, () => {
				unlockColor(shards[i]![1]);
				shardsCollected++;
				shards.splice(i, 1);
			});
		}
	}
}
