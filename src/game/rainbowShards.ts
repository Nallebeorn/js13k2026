import { IDENTITY, length, sub, type Vec3 } from "../core/math.ts";
import { currentTime } from "../core/time.ts";
import { COLOR_GREEN, unlockColor, type Color } from "../gamedata/colors.ts";
import { drawMesh } from "../rendering/renderer.ts";
import { rainbowMesh } from "../rendering/vertexData.ts";
import { getPlayerPos } from "./player.ts";

export const shards: [pos: Vec3, color: Color][] = [
	[[-30, 21, -16], COLOR_GREEN]
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

		if (length(sub(shards[i]![0], getPlayerPos())) < 3) {
			unlockColor(shards[i]![1]);
			shardsCollected++;
			shards.splice(i, 1);
		}
	}
}
