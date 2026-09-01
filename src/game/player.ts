import { rotateTowards, radtodeg, withLength, IDENTITY, add, type Vec3, midpoint, normalize, TAU, length, scale, sub, dot, clamp, spring, lerp } from "../core/math.ts";
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
	obj_cube2x2x1,
    obj_unicorn_hornPivotSlot,
		obj_rainbow,
} from "../gamedata/objects.gen.ts";
import { isKeyHeld, mouseDeltaX, mouseDeltaY, wasKeyJustPressed } from "../input/input.ts";
import { penetrateSphereGeneric, type BoxCollider, type Collider, type SphereCollider } from "../physics/collision.ts";
import { cameraTransform, drawObject, ROOT_SLOT, updateCameraTransform, type SlotTransforms } from "../rendering/renderer.ts";

const SPEED = 15;
const BOOST_SPEED = 25;
const BOOST_DELAY = 1;
const ACCELERATION = 45;
const DECELERATION = 90;
const JUMP_SPEED = 30;
const WALL_JUMP_SPEED = 60;
const GRAVITY = 100;
const FALL_SPEED = 30;

let x = 0;
let y = 0;
let z = -6;
let rotation = 0;
let dirx = 1;
let diry = 0;
let vx = 0;
let vy = 0;
let vz = 0;
let boostCharge = 0;
let wallJumping = false;
let grounded = false;

let springSpd = 0;
let springRot = 0;

let cameraYaw = 180;
let cameraPitch = 0;

enum PlayerState {
	MOVING,
	WALL_LODGE,
}

let state = PlayerState.MOVING;

let isGrinding = false;
let grindStart: Vec3;
let grindLength: number;

const sphere = (x: number, y: number, z: number): SphereCollider => ({
	pos: [x, y, z],
	r: 0.5,
});

const box = (x: number, y: number, z: number): BoxCollider => ({
	min: add([x, y, z], [-1, -1.5, -1]),
	max: add([x, y, z], [1, -0.5, 1]),
});

const colliders: Collider[] = [
	sphere(0, 0, 0),
	box(2, 0, 0),
	box(2, 1, 0),
	box(2, 2, 0),
	box(2, 3, 0),
	box(2, 4, 0),

	box(-1, 0, 0),
	box(-1, 1, 0),
	box(2, 5, 0),
	box(2, 6, 0),
];

export function processPlayer() {
	if (state == PlayerState.MOVING) processMovingState();
	if (state == PlayerState.WALL_LODGE) processWallLodgedState();

	debugWatch("vx", vx.toFixed(3));
	debugWatch("vz", vz.toFixed(3));

	// ? Draw level
	for (const collider of colliders) {
		if ("r" in collider) {
				drawObject(obj_unitSphere, {_: { translation: collider.pos}});
		} else {
			drawObject(obj_cube2x2x1, { _: { translation: add(midpoint(collider.min, collider.max), [0, -.5, 0]) } });
		}
	}

	// ? Draw unicorn
	drawObject(obj_unicorn, {
		[ROOT_SLOT]: {
			translation: [x, y, z],
			euler: [0, rotation, 0],
		},
		[obj_unicorn_hornPivotSlot]: {
			euler: [springRot, 0, 0],
		},
		...getAnimation()
	});

	if (isGrinding) {
		drawObject(obj_rainbow, {
			_: {
				translation: grindStart,
				euler: [0, -radtodeg(Math.atan2(diry, dirx)) + 90, 0],
			}
		}, undefined, grindLength);
	}

	// ? Camera controls
	const moveYaw = mouseDeltaX * .1;
	const movePitch = mouseDeltaY * .1;
	cameraYaw += -moveYaw * 180 * deltaTime;
	cameraPitch = clamp(cameraPitch - movePitch * 180 * deltaTime, -80, 30)
	debugWatch("pitch", cameraPitch.toFixed(3));
	updateCameraTransform(
		IDENTITY
			.translate(x, y, z)
			.rotate(cameraPitch, cameraYaw, 0)
			.translate(0, 1, 18)
	);
}

function processMovingState() {
	if (isGrinding) {
		vx += dirx * ACCELERATION * deltaTime;
		vz += diry * ACCELERATION * deltaTime;
		boostCharge += deltaTime * 2;
	} else {
		const [movex, movey] = withLength(
			[isKeyHeld("KeyD") - isKeyHeld("KeyA"), isKeyHeld("KeyS") - isKeyHeld("KeyW")],
			ACCELERATION * deltaTime
		)
		const move = cameraTransform.transformPoint(new DOMPoint(movex, 0, movey, 0));
		vx += move.x;
		vz += move.z;

		if (movex || movey) {
			// if (!wasKeyJustPressed("Space")) {
				[dirx, , diry] = normalize([move.x, , move.z] as unknown as Vec3);
			// }
			const turnBoost = -dot([dirx, 0, diry], normalize([vx, 0, vz])) * .5 + .5;
			[vx,, vz] = add([vx, 0, vz], withLength([dirx, 0, diry], DECELERATION * turnBoost * deltaTime));
		} else {
			const decel = withLength(
				[vx, 0, vz],
				Math.min(length([vx, 0, vz]), DECELERATION * deltaTime),
			);
			[vx, , vz] = sub([vx, 0, vz], decel);
		}

		vy = Math.max(vy - GRAVITY * deltaTime, -FALL_SPEED);
	}

	const speed = length([vx, 0, vz]);
	[vx, , vz] = withLength([vx, 0, vz], Math.min(boostCharge > BOOST_DELAY || isGrinding ? BOOST_SPEED : SPEED, speed));
	debugWatch("speed", speed.toFixed(3));
	grindLength += speed * deltaTime * 2;

	rotation = rotateTowards(rotation, -radtodeg(Math.atan2(diry, dirx)) + 90, deltaTime * 720)

	y += vy * deltaTime;
	x += vx * deltaTime;
	z += vz * deltaTime;

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
		if (vx) {
			vx += depenetration[0] / deltaTime;
		}
		z += depenetration[2];
		if (vz) {
			vz += depenetration[2] / deltaTime;
		}
		if (!grounded && dot(normalize(depenetration), [-dirx, 0, -diry]) > 0.3) {
			if (isGrinding) {
				isGrinding = false;
				vx = 0;
				vz = 0;
				boostCharge = 0;
			} else if (boostCharge > BOOST_DELAY) {
				// ? activate wall lodge
				state = PlayerState.WALL_LODGE;
				x -= dirx * .8;
				z -= diry * .8;
				boostCharge = 0;
				springRot = 45;
				vx = 0;
				vz = 0;
				isGrinding = false;
			}
		}
	}

	grounded = false;
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
		wallJumping = false;

		if (speed >= SPEED) {
			boostCharge += deltaTime;
		} else {
			boostCharge = 0;
		}
	}

	if (wasKeyJustPressed("Space")) {
		if (grounded || isGrinding) {
			vy = JUMP_SPEED;
			isGrinding = false;
		} else if (!grounded) {
			// ? activate grinding
			isGrinding = true;
			vy = 0;
			vx = dirx * SPEED;
			vz = diry * SPEED;
			grindStart = [x, y - 1.4, z];
			grindLength = 0;
			wallJumping = false;
		}
	}

	debugWatch("boost", boostCharge.toFixed(2));
}

function processWallLodgedState() {
	if (isKeyHeld("Space")) {
		springSpd = 0;
		springRot = lerp(springRot, -60, 0.08);
	} else {
		if (springRot < -55) {
			state = PlayerState.MOVING;
			vy = WALL_JUMP_SPEED;
			wallJumping = true;
			springRot = 0;
			springSpd = 0;
		} else {
			springSpd = spring(springRot, springSpd);
			springRot += springSpd;
		}
	}
}

function getAnimation(): Partial<SlotTransforms> {
	// return grindAnimation();
	if (isGrinding) return grindAnimation();
	if (state == PlayerState.WALL_LODGE) return wallLodgedAnimation();
	if (!grounded && wallJumping) return wallJumpAnimation();
	if (!grounded && boostCharge > BOOST_DELAY) return boostJumpAnimation();
	if (vy > 0) return jumpAnimation();
	if (vy < 0) return fallAnimation();
	if (vx || vz) return runAnimation();
	return idleAnimation();
}

function runAnimation(): Partial<SlotTransforms> {
	const runAnimationTime = boostCharge > BOOST_DELAY ? currentTime * 30 : currentTime * 19;
	return {
		[obj_unicorn_bodySlot]: {
			translation: [0, Math.cos(runAnimationTime) * .1, 0],
		},
		[obj_unicorn_tailSlot]: {
			euler: [Math.sin(runAnimationTime) * 45 + 60, 0, 0],
		},
		[obj_unicorn_tail2Slot]: {
			euler: [Math.sin(runAnimationTime - 1) * 45, 0, 0],
		},
		[obj_unicorn_tail3Slot]: {
			euler: [Math.sin(runAnimationTime - 2) * 45, 0, 0],
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

function idleAnimation(): Partial<SlotTransforms> {
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

function jumpAnimation(): Partial<SlotTransforms> {
	return {
		[obj_unicorn_bodySlot]: {
			euler: [-15, 0, 0],
		},
		[obj_unicorn_headSlot]: {
			euler: [10, 0, 0],
		},

		[obj_unicorn_foreLegRSlot]: {
			euler: [-60, 0, 0]
		},
		[obj_unicorn_foreLegBowRSlot]: {
			euler: [120, 0, 0],
		},
		[obj_unicorn_foreLegLSlot]: {
			euler: [-60, 0, 0]
		},
		[obj_unicorn_foreLegBowLSlot]: {
			euler: [120, 0, 0],
		},

		[obj_unicorn_hindLegRSlot]: {
			euler: [45, 0, 0]
		},
		[obj_unicorn_hindLegLSlot]: {
			euler: [45, 0, 0]
		},

		[obj_unicorn_tailSlot]: {
			euler: [Math.sin(currentTime * 19) * 45 + 60, 0, 0],
		},
		[obj_unicorn_tail2Slot]: {
			euler: [Math.sin(currentTime * 19 - 1) * 45, 0, 0],
		},
		[obj_unicorn_tail3Slot]: {
			euler: [Math.sin(currentTime * 19 - 2) * 45, 0, 0],
		},
	}
}

function fallAnimation(): Partial<SlotTransforms> {
	return {
		[obj_unicorn_bodySlot]: {
			euler: [15, 0, 0],
		},
		[obj_unicorn_headSlot]: {
			euler: [-10, 0, 0],
		},

		[obj_unicorn_foreLegRSlot]: {
			euler: [-45, 0, 0]
		},

		[obj_unicorn_foreLegLSlot]: {
			euler: [-60, 0, 0]
		},
		[obj_unicorn_foreLegBowLSlot]: {
			euler: [15, 0, 0],
		},

		[obj_unicorn_hindLegRSlot]: {
			euler: [-45, 0, 0]
		},
		[obj_unicorn_hindKneeRSlot]: {
			euler: [90, 0, 0],
		},
		[obj_unicorn_hindHeelRSlot]: {
			euler: [-90, 0, 0],
		},

		[obj_unicorn_hindLegLSlot]: {
			euler: [-45, 0, 0]
		},
		[obj_unicorn_hindKneeLSlot]: {
			euler: [90, 0, 0],
		},
		[obj_unicorn_hindHeelLSlot]: {
			euler: [-90, 0, 0],
		},

		[obj_unicorn_tailSlot]: {
			euler: [Math.sin(currentTime * 19) * 45 + 120, 0, 0],
		},
		[obj_unicorn_tail2Slot]: {
			euler: [Math.sin(currentTime * 19 - 1) * 45, 0, 0],
		},
		[obj_unicorn_tail3Slot]: {
			euler: [Math.sin(currentTime * 19 - 2) * 45, 0, 0],
		},
	}
}

function boostJumpAnimation(): Partial<SlotTransforms> {
	return {
		[obj_unicorn_bodySlot]: {
			euler: [0, 0, currentTime * 1666]
		},
		[obj_unicorn_neckSlot]: {
			euler: [45, 0, 0],
		},
		[obj_unicorn_foreLegBowRSlot]: {
			euler: [120, 0, 0],
		},
		[obj_unicorn_foreLegBowLSlot]: {
			euler: [120, 0, 0],
		},

		[obj_unicorn_hindLegRSlot]: {
			euler: [45, 0, 0]
		},
		[obj_unicorn_hindLegLSlot]: {
			euler: [45, 0, 0]
		},

		[obj_unicorn_tailSlot]: {
			euler: [45, 0, 0]
		},
		[obj_unicorn_tail2Slot]: {
			euler: [0, 0, 60]
		},
		[obj_unicorn_tail3Slot]: {
			euler: [0, 0, 60]
		}
	}
}

function wallLodgedAnimation(): Partial<SlotTransforms> {
	return {
		[obj_unicorn_neckSlot]: {
			euler: [45, 0, 0],
		},

		[obj_unicorn_foreLegLSlot]: {
			euler: [0, 0, Math.sin(currentTime * 4) * 15],
		},
		[obj_unicorn_foreLegRSlot]: {
			euler: [0, 0, Math.sin(currentTime * 4 + 1) * 15],
		},
		[obj_unicorn_hindLegLSlot]: {
			euler: [0, 0, Math.sin(currentTime * 4 + 2) * 15],
		},
		[obj_unicorn_hindLegRSlot]: {
			euler: [0, 0, Math.sin(currentTime * 4 + 3) * 15],
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
	}
}


function wallJumpAnimation(): Partial<SlotTransforms> {
	return {
		[obj_unicorn_bodySlot]: {
			euler: [currentTime * 1666, 0, 0],
		}
	}
}


function grindAnimation(): Partial<SlotTransforms> {
	return {
		[obj_unicorn_bodySlot]: {
			euler: [-15, 0, 0],
		},
		[obj_unicorn_neckSlot]: {
			euler: [Math.sin(currentTime * 16) * 16, 0, Math.sin(currentTime * 4) * 16],
		},
		[obj_unicorn_headSlot]: {
			euler: [Math.sin(currentTime * 16 - 1) * 16, 0, 0],
		},

		[obj_unicorn_tailSlot]: {
			euler: [Math.sin(currentTime * 19) * 45 + 100, 0, 0],
		},
		[obj_unicorn_tail2Slot]: {
			euler: [Math.sin(currentTime * 19 - 1) * 45, 0, 0],
		},
		[obj_unicorn_tail3Slot]: {
			euler: [Math.sin(currentTime * 19 - 2) * 45, 0, 0],
		},

		[obj_unicorn_hindLegLSlot]: {
			euler: [-15, 0, 5],
		},
		[obj_unicorn_hindLegRSlot]: {
			euler: [-15, 0, -5],
		},

		[obj_unicorn_foreLegLSlot]: {
			euler: [15, 0, 5],
		},
		[obj_unicorn_foreLegRSlot]: {
			euler: [15, 0, -5],
		}
	}
}
