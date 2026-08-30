import { rotateTowards, radtodeg, withLength, IDENTITY, add, type Vec3, midpoint, normalize, TAU, length, scale, sub, dot } from "../core/math.ts";
import { currentTime, delta as deltaTime } from "../core/time.ts";
import { debugWatch } from "../debug.ts";
import {
	obj_unitSphere,
	obj_unitCube,
	obj_unicorn,
	obj_unicorn_neckSlot,
	obj_unicorn_headSlot,
	obj_unicorn_tailSlot,
	obj_unicorn_hindLegRSlot,
	obj_unicorn_hindKneeRSlot,
	obj_unicorn_hindHeelRSlot,
	obj_unicorn_hindLegLSlot,
	obj_unicorn_hindKneeLSlot,
	obj_unicorn_hindHeelLSlot,
	obj_unicorn_foreLegRSlot,
	obj_unicorn_foreLegLSlot,
	obj_unicorn_foreLegBowRSlot,
	obj_unicorn_foreLegBowLSlot,
	obj_unicorn_bodySlot,
	obj_unicorn_tail2Slot,
	obj_unicorn_tail3Slot,
} from "../gamedata/objects.gen.ts";
import { isKeyHeld, mouseDeltaX, wasKeyJustPressed } from "../input/input.ts";
import { penetrateSphereGeneric, type BoxCollider, type Collider, type SphereCollider } from "../physics/collision.ts";
import { cameraTransform, drawScene, ROOT_SLOT, updateCameraTransform, type SlotTransforms } from "../rendering/renderer.ts";

const SPEED = 15;
const ACCELERATION = 15;
const DECELERATION = 20;
const GRAVITY = 80;

let x = 0;
let y = 0;
let z = -6;
let rotation = 0;
let dirx = 0;
let diry = 0;
let vx = 0;
let vy = 0;
let vz = 0;

let cameraRotation = 0;

export function processPlayer() {
	const [movex, movey] = withLength(
		[isKeyHeld("KeyD") - isKeyHeld("KeyA"), isKeyHeld("KeyS") - isKeyHeld("KeyW")],
		ACCELERATION * deltaTime
	)
	const move = cameraTransform.transformPoint(new DOMPoint(movex, 0, movey, 0));
	vx += move.x;
	vz += move.z;


	const speed = length([vx, 0, vz]);
	[vx, , vz] = withLength([vx, 0, vz], Math.min(SPEED, speed));
	debugWatch("speed", speed.toFixed(3));

	if (movex || movey) {
		[dirx, , diry] = normalize([move.x, , move.z] as unknown as Vec3);
		const turnBoost = -dot([dirx, 0, diry], normalize([vx, 0, vz])) * .5 + .5;
		[vx,, vz] = add([vx, 0, vz], withLength([dirx, 0, diry], DECELERATION * turnBoost * deltaTime));
		debugWatch("turnboost", turnBoost.toFixed(3));
	} else {
		const decel = withLength(
			[vx, 0, vz],
			Math.min(length([vx, 0, vz]), DECELERATION * deltaTime),
		);
		[vx, , vz] = sub([vx, 0, vz], decel);
	}

	rotation = rotateTowards(rotation, -radtodeg(Math.atan2(diry, dirx)) + 90, deltaTime * 720)

	vy -= GRAVITY * deltaTime;
	y += vy * deltaTime;
	x += vx * deltaTime;
	z += vz * deltaTime;


	const sphere = (x: number, y: number, z: number): SphereCollider => ({pos: [x, y, z], r: 0.5});
	const box = (x: number, y: number, z: number): BoxCollider => ({
		min: add([x, y, z], [-0.5, 0, -0.5]),
		max: add([x, y, z], [0.5, 1, 0.5])
	});

	const colliders: Collider[] = [
		// sphere(0, 0, 0),
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
				[dirx/2, 0, diry/2],
				[dirx/2, -1, diry/2],
				[-dirx/2, 0, -diry/2],
				[-dirx/2, -1, -diry/2],
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
		if (normalize(depenetration)[1] > 0.5) {
			vy += depenetration[1] / deltaTime;
			grounded = true;
		}
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
	}

	for (const collider of colliders) {
		if ("r" in collider) {
				drawScene(obj_unitSphere, {_: { translation: collider.pos}});
		} else {
			drawScene(obj_unitCube, { _: { translation: add(midpoint(collider.min, collider.max), [0, -.5, 0]) } });
		}
	}

	// const runAnimationTime = Math.PI / 2;


	drawScene(obj_unicorn, {
		[ROOT_SLOT]: {
			translation: [x, y, z],
			euler: [0, rotation, 0]
		},
		...(vx || vy ? runAnimation() : neighAnimation())
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

function runAnimation(): Partial<SlotTransforms> {
	const runAnimationTime = currentTime * 19;
	return {
		[obj_unicorn_bodySlot]: {
			translation: [0, Math.cos(runAnimationTime) * .1, 0],
		},
		[obj_unicorn_tailSlot]: {
			euler: [Math.sin(runAnimationTime) * 45 + 60, 0, 0],
		},
		[obj_unicorn_tail2Slot]: {
			euler: [Math.sin(runAnimationTime - Math.PI / 2) * 45, 0, 0],
		},
		[obj_unicorn_tail3Slot]: {
			euler: [Math.sin(runAnimationTime - Math.PI) * 45, 0, 0],
		},
		[obj_unicorn_neckSlot]: {
			euler: [Math.sin(runAnimationTime) * 15, 0, 0],
		},
		[obj_unicorn_headSlot]: {
			euler: [Math.sin(runAnimationTime) * -10, 0, 0],
		},


		[obj_unicorn_hindLegRSlot]: {
			euler: [Math.cos(runAnimationTime) * 45, 0, 0],
		},
		[obj_unicorn_hindKneeRSlot]: {
			euler: [Math.sin(runAnimationTime) * 60 + 60, 0, 0],
		},
		[obj_unicorn_hindHeelRSlot]: {
			euler: [Math.sin(runAnimationTime) * -90, 0, 0],
		},

		[obj_unicorn_hindLegLSlot]: {
			euler: [Math.cos(runAnimationTime + 2) * 45, 0, 0],
		},
		[obj_unicorn_hindKneeLSlot]: {
			euler: [Math.sin(runAnimationTime + 2) * 60 + 60, 0, 0],
		},
		[obj_unicorn_hindHeelLSlot]: {
			euler: [Math.sin(runAnimationTime + 2) * -90 - 45, 0, 0],
		},

		[obj_unicorn_foreLegRSlot]: {
			euler: [Math.cos(runAnimationTime + Math.PI) * 30 - 30, 0, 0],
		},
		[obj_unicorn_foreLegBowRSlot]: {
			euler: [Math.sin(runAnimationTime + Math.PI) * -45 + 30, 0, 0]
		},

		[obj_unicorn_foreLegLSlot]: {
			euler: [Math.cos(runAnimationTime + Math.PI + 1) * 30 - 45, 0, 0],
		},
		[obj_unicorn_foreLegBowLSlot]: {
			euler: [Math.sin(runAnimationTime + Math.PI + 1) * -45 + 30, 0, 0]
		},
	};
}

function neighAnimation(): Partial<SlotTransforms> {
	const t = ((currentTime * 10 / Math.PI) % 14) <= 4 ? currentTime * 10 : 0;

	return {
		[obj_unicorn_neckSlot]: {
			euler: [
				Math.sin(t) * 15,
				Math.sin(t * 2) * 20,
				0,
			],
		},
		[obj_unicorn_headSlot]: {
			euler: [Math.sin(t) * 10, 0, 0],
		},
		[obj_unicorn_tailSlot]: {
			euler: [0, 0, Math.sin(currentTime * 8) * 15],
		},
		[obj_unicorn_tail2Slot]: {
			euler: [0, 0, Math.sin(currentTime * 8) * 15],
		},
		[obj_unicorn_tail3Slot]: {
			euler: [0, 0, Math.sin(currentTime * 8) * 15],
		},
	};
}
