import { withLength, rotateTowards, radtodeg, type Vec3, add, IDENTITY } from "../core/math.ts";
import { delta as deltaTime } from "../core/time.ts";
import { debugWatch } from "../debug.ts";
import { COLOR_RED, COLOR_GREEN, COLOR_BLUE } from "../gamedata/colors.ts";
import { obj_unitSphere, obj_unitCube } from "../gamedata/objects.gen.ts";
import { isKeyHeld, wasKeyJustPressed, mouseDeltaX } from "../input/input.ts";
import { type SphereCollider, type BoxCollider, penetrateSpheres, penetrateSphereCube } from "../physics/collision.ts";
import { cameraTransform, drawScene, ROOT_SLOT, updateCameraTransform } from "../rendering/renderer.ts";
import { SPEED, x, z, dirx, diry, rotation, y, vy, GRAVITY, cameraRotation } from "./player.ts";


export function processPlayer() {
	const [movex, movey] = withLength(
		[isKeyHeld("KeyD") - isKeyHeld("KeyA"), isKeyHeld("KeyS") - isKeyHeld("KeyW")],
		SPEED * deltaTime
	);
	const move = cameraTransform.transformPoint(new DOMPoint(movex, 0, movey, 0));
	x += move.x;
	z += move.z;

	if (movex || movey) {
		dirx = move.x;
		diry = move.z;
	}

	rotation = rotateTowards(rotation, -radtodeg(Math.atan2(diry, dirx)) + 90, deltaTime * 720);

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

	const boxPos: Vec3 = [2, 0, 0];
	const playerSphere: SphereCollider = { position: [x, y, z], radius: 0.5 };
	const staticSphere: SphereCollider = { position: [0, 0, 0], radius: 0.5 };
	const staticBox: BoxCollider = { min: add(boxPos, [-0.5, 0, -0.5]), max: add(boxPos, [0.5, 1, 0.5]) };
	const collision = penetrateSpheres(
		playerSphere,
		staticSphere
	);
	debugWatch("penetration", collision.depth.toFixed(3));
	[x, y, z] = add([x, y, z], collision.depenetration);
	vy += collision.depenetration[1] / deltaTime;
	drawScene(
		obj_unitSphere,
		{ [ROOT_SLOT]: { translation: [x, y, z] } },
		collision.depth > 0 ? COLOR_RED : COLOR_GREEN
	);
	drawScene(obj_unitSphere);

	const cubeCollision = penetrateSphereCube(playerSphere, staticBox);
	drawScene(obj_unitSphere, { [ROOT_SLOT]: { translation: cubeCollision.closest, scale: [.5, .5, .5] } }, COLOR_BLUE);
	debugWatch("cubepen", length(cubeCollision.depth));

	drawScene(obj_unitCube, { [ROOT_SLOT]: { translation: boxPos } });

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
    }) */ ;

	const moveYaw = mouseDeltaX * .1;
	cameraRotation += -moveYaw * 180 * deltaTime;
	updateCameraTransform(
		IDENTITY
			.translate(x, y, z)
			.rotate(0, cameraRotation, 0)
			.translate(0, 2, 12)
	);
}
