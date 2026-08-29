import { rotateTowards, radtodeg, withLength, IDENTITY, add, type Vec3, length, midpoint, normalize, scale, dot } from "../core/math.ts";
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
		[dirx, , diry] = normalize([move.x, , move.z] as unknown as Vec3);

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
		// {min: [2, 2, -0.5], max: [3, 20, 0.5]}
		box(2.5, 2, 0),
		box(2.5, 3, 0),
		box(2.5, 4, 0),
		box(2.5, 5, 0),
		box(2.5, 6, 0),
	];

	function* enumerateCollisions() {
		for (const levelCollider of colliders) {
			for (const playerCollider of [
				[0, 0, 0],
				[0, -1, 0],
				[-dirx, 0, -diry],
				[-dirx, -1, -diry],
			] satisfies Vec3[]) {
				const collision = penetrateSphereGeneric(
					add(playerCollider, [x, y, z]),
					0.5,
					levelCollider,
				);

				if (collision.depenetration) {
					yield collision.depenetration;
				}
			}
		}
	}

	for (const depenetration of enumerateCollisions()) {
		x += depenetration[0];
		z += depenetration[2];
	}

	let grounded = false;
	for (const depenetration of enumerateCollisions()) {
		y += depenetration[1];
		vy += depenetration[1] / deltaTime;
		grounded = true;
	}

	if (y <= 0) {
		y = 0;
		grounded = true;
	}

	debugWatch("grounded", grounded ? 1 : 0);

	if (grounded) {
		vy = 0;

		if (wasKeyJustPressed("Space")) {
			vy = 25;
		}
	} else {

	}

	for (const collider of colliders) {
		if ("r" in collider) {
				drawScene(obj_unitSphere, {_: { translation: collider.pos}});
		} else {
			drawScene(obj_unitCube, { _: { translation: add(midpoint(collider.min, collider.max), [0, -.5, 0]) } });
		}
	}

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
