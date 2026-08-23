import { withLength } from "../core/math.ts";
import { time as currentTime, delta as deltaTime } from "../core/time.ts";
import {
	obj_unicorn,
	obj_unicorn_headSlot,
	obj_unicorn_neckSlot,
	obj_unicorn_tailSlot,
} from "../gamedata/objects.gen.ts";
import { isKeyHeld } from "../input/input.ts";
import { drawScene, ROOT_SLOT } from "../rendering/renderer.ts";

const SPEED = 10;

let x = 0;
let z = -6;

export function processPlayer() {
	const [movex, movey] = withLength(
		[isKeyHeld("KeyD") - isKeyHeld("KeyA"), isKeyHeld("KeyS") - isKeyHeld("KeyW")],
		SPEED * deltaTime
	)
	x += movex;
	z += movey;

	drawScene(obj_unicorn, {
		[ROOT_SLOT]: {
			translation: [x, 0, z],
		},
		[obj_unicorn_neckSlot]: {
			euler: [
				Math.sin(currentTime * 10) * 15,
				Math.sin(currentTime * 20) * 20,
				0,
			],
		},
		[obj_unicorn_headSlot]: {
			euler: [Math.sin(0.2 + currentTime * 10) * 10, 0, 0],
		},
		[obj_unicorn_tailSlot]: {
			euler: [0, 0, Math.sin(currentTime * 8) * 30],
		},
	});
}
