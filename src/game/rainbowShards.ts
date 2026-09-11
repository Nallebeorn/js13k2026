import { easeInBack, IDENTITY, length, lerpv, sub, type Vec3 } from "../core/math.ts";
import { currentTime, deltaTime } from "../core/time.ts";
import { DEBUG } from "../debug.ts";
import { COLOR_VIOLET, unlockColor, type Color } from "../gamedata/colors.ts";
import { wasKeyJustPressed } from "../input/input.ts";
import type { KeyCode } from "../input/keycode.ts";
import { drawMesh } from "../rendering/renderer.ts";
import { doScreenWipe, transitionProgress } from "../rendering/screenTransition.ts";
import { rainbowMesh } from "../rendering/vertexData.ts";
import { onPlayerDeath } from "./bus.ts";
import { getPlayerPos } from "./player.ts";

export const shards: [color: Color, pos: Vec3[], currentPosIndex: number][] = [];

export let shardsCollected = 0;

let collectingShard: number;
export let shardCollectTimer = 0;

let movingShard: number;
let shardMovement = 0;

onPlayerDeath.push(() => {
	movingShard = -1;
	shardMovement = 0;
	for (let i = 0; i < shards.length; i++) {
		shards[i]![2] = 0;
	}
});

export function processRainbowShards() {
	for (let i = 0; i < shards.length; i++) {
		const [color, positions, posIndex] = shards[i]!;

		const scale = 0.75 * (1 - (+(collectingShard == i) && easeInBack(Math.min(1, shardCollectTimer += deltaTime * .8))));
		drawMesh(
			rainbowMesh,
			color + 10,
			IDENTITY.translate(
				...lerpv(
					positions[posIndex]!,
					positions[posIndex + 1],
					movingShard == i ? shardMovement : 0,
				),
			)
				.scale(scale, scale, scale)
				.rotate(
					-90,
					currentTime * (collectingShard == i || movingShard == i ? 1200 : 360),
					0
				)
				.translate(
					0,
					3,
					Math.sin(currentTime * 3)
					+ shardCollectTimer * 7,
				),
			7,
			1,
		);

		if (movingShard == i) {
			shardMovement += deltaTime;
			if (shardMovement > 1) {
				shardMovement = 0;
				movingShard = -1;
				shards[i]![2]++;
			}
		} else {
			if (color === COLOR_VIOLET) {
				console.log("collectable", posIndex, color, positions[posIndex]);
			}
			if (length(sub(positions[posIndex]!, getPlayerPos())) < 3 && !shardCollectTimer) {
				if (posIndex >= positions.length - 1) {
					collectingShard = i;
				} else {
					movingShard = i;
					shardMovement += deltaTime;
				}
			}
		}

		if (DEBUG && wasKeyJustPressed(`Digit${i + 1}` as KeyCode)) {
			unlockColor(color);
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
