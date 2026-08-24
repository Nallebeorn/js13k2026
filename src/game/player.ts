import { rotateTowards, radtodeg, withLength } from "../core/math.ts";
import { time as currentTime, delta as deltaTime } from "../core/time.ts";
import {
	obj_unicorn,
	obj_unicorn_headSlot,
	obj_unicorn_neckSlot,
	obj_unicorn_tailSlot,
} from "../gamedata/objects.gen.ts";
import { isKeyHeld, wasKeyJustPressed } from "../input/input.ts";
import { addVertexData, drawScene, ROOT_SLOT } from "../rendering/renderer.ts";
import { createBox } from "../rendering/shapes.ts";

const SPEED = 10;
const GRAVITY = 80;

let x = 0;
let y = 0;
let z = -6;
let rotation = 0;
let dirx = 0;
let diry = 0;
let vy = 0;

export function processPlayer() {
	const [movex, movey] = withLength(
		[isKeyHeld("KeyD") - isKeyHeld("KeyA"), isKeyHeld("KeyS") - isKeyHeld("KeyW")],
		SPEED * deltaTime
	)
	x += movex;
	z += movey;

	if (movex || movey) {
		dirx = movex;
		diry = movey;
	}

	rotation = rotateTowards(rotation, -radtodeg(Math.atan2(diry, dirx)) + 90, deltaTime * 720)

	if (y > 0) {
		vy -= GRAVITY * deltaTime;
	} else {
		vy = 0;
		y = 0;

		if (wasKeyJustPressed("Space")) {
			vy = 25;
		}
	}


	y += vy * deltaTime;

	drawScene(0, { [ROOT_SLOT]: { translation: [0, 0, -6] } });

/* 	drawScene(obj_unicorn, {
		[ROOT_SLOT]: {
			translation: [x, y, z],
			euler: [0, rotation, 0]
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
	}); */
}
