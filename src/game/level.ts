import { add, type Vec2, type Vec3 } from "../core/math.ts";
import { srand, srandf } from "../core/random.ts";
import {
	obj_unitSphere,
	obj_cube2x2x1,
	obj_cube32x32x1,
	obj_pillar10,
	obj_pillar5,
	type RenderObjectHandle,
	obj_cloud0,
} from "../gamedata/objects.gen.ts";
import { objectColliders } from "../physics/objectColliders.ts";
import { drawObject } from "../rendering/renderer.ts";

const levelGeometry: [RenderObjectHandle, Vec3][] = [
	[obj_pillar10, [-5, 1, -12]],
	[obj_pillar5, [-10, 1, -12]],
	[obj_unitSphere, [0, 0, 0]],
	[obj_cube2x2x1, [2, 0, 0]],
	[obj_cube2x2x1, [2, 1, 0]],
	[obj_cube2x2x1, [2, 2, 0]],
	[obj_cube2x2x1, [2, 3, 0]],
	[obj_cube2x2x1, [2, 4, 0]],
	[obj_cube2x2x1, [-1, 0, 0]],
	[obj_cube2x2x1, [-1, 1, 0]],
	[obj_cube2x2x1, [2, 5, 0]],
	[obj_cube2x2x1, [2, 6, 0]],
];

const clouds: [number, Vec2, Vec2][] = [
	[0, [-20, -20], [20, 20]],
];

export function drawLevel() {
	for (const [object, pos] of levelGeometry) {
		drawObject(object, { _: { translation: pos } });
	}

	let seed = 0;
	for (const [y, [xmin, zmin], [xmax, zmax]] of clouds) {
		for (let z = zmin; z <= zmax; z++) {
			for (let x = xmin; x <= xmax; x++) {
				drawObject(
					(obj_cloud0 + (srand(seed++) % 3)) as RenderObjectHandle,
					{
						_: {
							translation: add(
								[x, y, z],
								[0.2 * srandf(seed++), 0.2 * srandf(seed++), 0.2 * srandf(seed++)],
							),
						},
					},
					undefined,
					!seed,
				);
				objectColliders.push({ min: [xmin, y - .5, zmin], max: [xmax, y + .5, zmax] });
			}
		}
	}
}
