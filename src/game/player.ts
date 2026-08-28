import { rotateTowards, radtodeg, withLength, IDENTITY, add, type Vec3, length, midpoint, normalize, scale } from "../core/math.ts";
import { currentTime, delta as deltaTime } from "../core/time.ts";
import { debugWatch } from "../debug.ts";
import { COLOR_BLUE, COLOR_GREEN, COLOR_RED } from "../gamedata/colors.ts";
import {
	obj_unitSphere,
	obj_unitCube,
	obj_unicorn,
	obj_unicorn_neckSlot,
	obj_unicorn_headSlot,
	obj_unicorn_tailSlot,
	obj_playerCollider,
} from "../gamedata/objects.gen.ts";
import { isKeyHeld, mouseDeltaX, wasKeyJustPressed } from "../input/input.ts";
import { penetrateSphereGeneric, penetrateSphereBox, penetrateSphereSphere, type BoxCollider, type Collider, type SphereCollider, penetrateCapsuleGeneric } from "../physics/collision.ts";
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

	vy -= GRAVITY * deltaTime;
	y += vy * deltaTime;

	const sphere = (x: number, y: number, z: number): SphereCollider => ({pos: [x, y, z], r: 0.5});
	const box = (x: number, y: number, z: number): BoxCollider => ({
		min: add([x, y, z], [-0.5, 0, -0.5]),
		max: add([x, y, z], [0.5, 1, 0.5])
	});

	const colliders: Collider[] = [
		sphere(0, 0, 0),
		box(2, 0, 0),
		box(3, 0, 0),
		box(2.5, 1, 0),
	];

	let grounded = false;
	for (const collider of colliders) {
		const collision = penetrateCapsuleGeneric([x, y, z], scale(normalize([dirx, 0, diry]), .5), 0.5, collider);

		if (collision.depenetration) {
			[x, y, z] = add([x, y, z], collision.depenetration);
			if (collision.depenetration[1] > 0) {
				grounded = true;
			}
			vy += collision.depenetration[1] / deltaTime;
		}

		/* if ("projected" in collision) {
			drawScene(obj_unitSphere, {
				_: {
					translation: collision.projected as Vec3,
				}
			});
		} */
	}

	drawScene(obj_playerCollider, {
		_: {
			translation: [x, y, z],
			euler: [0, rotation, 0]
		}
	});


	if (y < 0) {
		y = 0;
		grounded = true;
	}

	if (grounded) {
		vy = 0;

		if (wasKeyJustPressed("Space")) {
			vy = 25;
		}
	}

	for (const collider of colliders) {
		if ("r" in collider) {
				drawScene(obj_unitSphere, {_: { translation: collider.pos}});
		} else {
			drawScene(obj_unitCube, { _: { translation: add(midpoint(collider.min, collider.max), [0, -.5, 0]) } });
		}
	}

	/* drawScene(obj_unicorn, {
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
	}) */;

	const moveYaw = mouseDeltaX * .1;
	cameraRotation += -moveYaw * 180 * deltaTime;
	updateCameraTransform(
		IDENTITY
			.translate(x, y, z)
			.rotate(0, cameraRotation, 0)
			.translate(0, 2, 12)
	);
}
