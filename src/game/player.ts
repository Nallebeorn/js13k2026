import { rotateTowards, radtodeg, withLength, IDENTITY, add, type Vec3, normalize, length, sub, dot, clamp, spring, lerp } from "../core/math.ts";
import { currentTime, delta as deltaTime } from "../core/time.ts";
import { debugWatch } from "../debug.ts";
import { COLOR_RAINBOW } from "../gamedata/colors.ts";
import {
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
	obj_unicorn_hornPivotSlot,
} from "../gamedata/objects.gen.ts";
import { isKeyHeld, mouseDeltaX, mouseDeltaY, wasKeyJustPressed } from "../input/input.ts";
import { penetrateSphereGeneric, type Collision, type ConfirmedCollision } from "../physics/collision.ts";
import { staticColliders } from "../physics/objectColliders.ts";
import { cameraTransform, drawMesh, drawObject, rainbowMesh, ROOT_SLOT, updateCameraTransform, type SlotTransforms } from "../rendering/renderer.ts";

const SPEED = 20;
const BOOST_SPEED = 25;
const BOOST_DELAY = 1;
const ACCELERATION = 45;
const DECELERATION = 90;
const JUMP_SPEED = 30;
const WALL_JUMP_SPEED = 60;
const GRAVITY = 100;
const FALL_SPEED = 30;
const GRIND_LENGTH = 20;

let x = 0;
let y = 2;
let z = -6;

let respawnPoint: Vec3 = [x, y, z];

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

export function processPlayer() {
	const t0 = performance.now();
	if (state == PlayerState.MOVING) processMovingState();
	if (state == PlayerState.WALL_LODGE) processWallLodgedState();

	// debugWatch("vx", vx.toFixed(3));
	// debugWatch("vz", vz.toFixed(3));

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
		drawMesh(
			rainbowMesh,
			COLOR_RAINBOW,
			IDENTITY
				.translate(...grindStart)
				.rotate(0, -radtodeg(Math.atan2(diry, dirx)) + 90, 0),
			grindLength * 2,
			GRIND_LENGTH - 5
		);
	}

	// ? Camera controls
	const moveYaw = mouseDeltaX * .1;
	const movePitch = mouseDeltaY * .1;
	cameraYaw += -moveYaw * 180 * deltaTime;
	cameraPitch = clamp(cameraPitch - movePitch * 180 * deltaTime, -80, 30)
	updateCameraTransform(
		IDENTITY
			.translate(x, y, z)
			.rotate(cameraPitch, cameraYaw, 0)
			.translate(0, 3, 18)
	);

	debugWatch("player", performance.now() - t0);
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
			[dirx, , diry] = normalize([move.x, , move.z] as unknown as Vec3);
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
	rotation = rotateTowards(rotation, -radtodeg(Math.atan2(diry, dirx)) + 90, deltaTime * 720)

	if (isGrinding) {
		grindLength = grindLength + speed * deltaTime;
		debugWatch("grind length", grindLength);
		if (grindLength > GRIND_LENGTH) {
			isGrinding = false;
			boostCharge = 0;
		}
	}

	function* enumerateCollisions() {
		for (const levelCollider of staticColliders) {
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
					yield collision as ConfirmedCollision;
				}
			}
		}
	}

	x += vx * deltaTime;
	z += vz * deltaTime;

	const t1 = performance.now();
	for (const {depenetration} of enumerateCollisions()) {
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
				boostCharge = 0;
				vx = 0;
				vz = 0;
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

	y += vy * deltaTime;

	grounded = false;
	for (const { depenetration, safePoint } of enumerateCollisions()) {
		if (safePoint) {
			respawnPoint = safePoint;
		}
		y += depenetration[1];
		if (Math.abs(normalize(depenetration)[1]) > 0.5) {
			vy += depenetration[1] / deltaTime;
			grounded = true;
		}
	}

	debugWatch("playercoll", performance.now() - t1);

	if (y < -50) {
		// * Die and respawn
		[x, y, z] = respawnPoint;
		vx = 0;
		vy = 0;
		vz = 0;
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
			boostCharge = 0;
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
			euler: [-15, Math.min(boostCharge * 2 * 360, 360), 0],
		},
		[obj_unicorn_neckSlot]: {
			euler: [Math.sin(currentTime * 16) * 16, 0, Math.sin(currentTime * 4) * 16],
		},
		[obj_unicorn_headSlot]: {
			euler: [Math.sin(currentTime * 16 - 1) * 16, 0, 0],
		},

		[obj_unicorn_tailSlot]: {
			euler: [Math.sin(currentTime * 22) * 15 + 100, 0, Math.sin(currentTime * 22) * 15],
		},
		[obj_unicorn_tail2Slot]: {
			euler: [Math.sin(currentTime * 22 - 1) * 45, 0, Math.sin(currentTime * 22) * 15],
		},
		[obj_unicorn_tail3Slot]: {
			euler: [Math.sin(currentTime * 22 - 2) * 45, 0, Math.sin(currentTime * 22) * 15],
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
