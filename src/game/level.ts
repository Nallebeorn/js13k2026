import { add, createMatrix, lerp, type Vec2, type Vec3 } from "../core/math.ts";
import { srand, srandf } from "../core/random.ts";
import { COLOR_WHITE } from "../gamedata/colors.ts";
import {
	obj_unitSphere,
	obj_cube2x2x1,
	obj_pillar10,
	obj_pillar5,
	type RenderObjectHandle,
} from "../gamedata/objects.gen.ts";
import { staticColliders } from "../physics/objectColliders.ts";
import { drawMesh, drawObject, incrementObjectIndex, unitSphere } from "../rendering/renderer.ts";

const levelGeometry: [RenderObjectHandle, Vec3, Vec3?][] = [
	[obj_pillar10, [-10, 1, -8]],
	[obj_pillar5, [-10, 1, -12]],
	[obj_pillar10, [0, 1, -12], [90, 0, 0]],
	[obj_pillar10, [-5, 1, -15], [-90, 0, 0]],
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
	[0, [-15, -15], [5, 5]],
	[0, [-10, 10], [0, 50]],
	[0, [-10, -40], [0, -25]],
];

for (const [object, translation, euler] of levelGeometry) {
	drawObject(object, { _: { translation, euler } }, undefined, true);
}

let seed = 0;
for (const [y, [xmin, zmin], [xmax, zmax]] of clouds) {
	for (let z = zmin; z <= zmax; z += 0.75) {
		for (let x = xmin; x <= xmax; x += 0.75) {
			drawMesh(
				unitSphere,
				COLOR_WHITE,
				createMatrix({
					translation: add(
						[x, y, z],
						[0.2 * srandf(seed++), 0.2 * srandf(seed++), 0.2 * srandf(seed++)],
					),
					scale: 0.75 + srandf(seed++) * .25
				}),
				1,
				0,
				true,
			);
		}
	}

	staticColliders.push({
		min: [xmin, y - 1, zmin],
		max: [xmax, y, zmax],
		safePoint: [xmin * 0.5 + xmax * 0.5, y+1.5, zmin * 0.5 + zmax * 0.5],
	});
	incrementObjectIndex();
}
