import { clamp, easeInBack, IDENTITY, length, sub, type Vec3 } from "../core/math.ts";
import { currentTime, deltaTime } from "../core/time.ts";
import { DEBUG } from "../debug.ts";
import { COLOR_GREEN, COLOR_YELLOW, unlockColor, type Color } from "../gamedata/colors.ts";
import { wasKeyJustPressed } from "../input/input.ts";
import type { KeyCode } from "../input/keycode.ts";
import { drawMesh } from "../rendering/renderer.ts";
import { doScreenWipe, transitionProgress } from "../rendering/screenTransition.ts";
import { rainbowMesh } from "../rendering/vertexData.ts";
import { getPlayerPos } from "./player.ts";

export const shards: [color: Color, pos: Vec3][] = [];

export let shardsCollected = 0;

let collectingShard: number;
export let shardCollectTimer = 0;

export function processRainbowShards() {
	for (let i = 0; i < shards.length; i++) {
		const scale = 0.75 * (1 - (+(collectingShard == i) && easeInBack(Math.min(1, shardCollectTimer += deltaTime * .8))));
		drawMesh(
			rainbowMesh,
			shards[i]![0] + 10,
			IDENTITY.translate(...shards[i]![1])
				.scale(scale, scale, scale)
				.rotate(-90, currentTime * (collectingShard == i ? 1200 : 360), 0)
				.translate(
					0,
					3,
					Math.sin(currentTime * 3)
					+ shardCollectTimer * 7,
				),
			7,
			1,
		);

		if (length(sub(shards[i]![1], getPlayerPos())) < 3 && !shardCollectTimer) {
			collectingShard = i;
		}

		if (DEBUG && wasKeyJustPressed(`Digit${i + 1}` as KeyCode)) {
			unlockColor(shards[i]![0]);
			shardsCollected++;
			setTimeout(() => shards.splice(i, 1), 0);
			;
		}
	}

	if (shardCollectTimer > 1 && !transitionProgress) {
		doScreenWipe(shards[collectingShard]![0] + 10, () => {
			unlockColor(shards[collectingShard]![0]);
			shardsCollected++;
			shards.splice(collectingShard, 1);
			collectingShard = -1;
			shardCollectTimer = 0;
		});
	}

}
