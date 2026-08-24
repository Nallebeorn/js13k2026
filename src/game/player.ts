import { rotateTowards, radtodeg, withLength, IDENTITY, degtorad } from "../core/math.ts";
import { time as currentTime, delta as deltaTime } from "../core/time.ts";
import {
	obj_unicorn,
	obj_unicorn_headSlot,
	obj_unicorn_neckSlot,
	obj_unicorn_tailSlot,
} from "../gamedata/objects.gen.ts";
import { isKeyHeld, mouseDeltaX, wasKeyJustPressed } from "../input/input.ts";
import { cameraTransform, drawScene, ROOT_SLOT, updateCameraTransform } from "../rendering/renderer.ts";

const SPEED = 10;
const GRAVITY = 80;

let x = 0;
let y = 0;
let z = -6;
let rotation = 0;
let dirx = 0;
let diry = 0;
let vy = 0;

let cameraRotation = 0;

export function processPlayer() {
	const [movex, movey] = withLength(
		[isKeyHeld("KeyD") - isKeyHeld("KeyA"), isKeyHeld("KeyS") - isKeyHeld("KeyW")],
		SPEED * deltaTime
	)
	const move = cameraTransform.transformPoint(new DOMPoint(movex, 0, movey, 0));
	x += move.x;
	z += move.z;

	if (movex || movey) {
		dirx = move.x;
		diry = move.z;
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

	drawScene(obj_unicorn, {
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
	});

	const moveYaw = mouseDeltaX * .1;
	cameraRotation += -moveYaw * 180 * deltaTime;
	updateCameraTransform(
		IDENTITY
			.translate(x, y, z)
			.rotate(0, cameraRotation, 0)
			.translate(0, 2, 12)
	);
}
