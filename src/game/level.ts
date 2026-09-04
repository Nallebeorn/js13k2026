import { add, createMatrix, type Vec2, type Vec3 } from "../core/math.ts";
import { srand, srandf } from "../core/random.ts";
import { debugWatch } from "../debug.ts";
import { COLOR_WHITE } from "../gamedata/colors.ts";
import {
	obj_unitSphere,
	obj_cube2x2x1,
	obj_pillar10,
	obj_pillar5,
	type RenderObjectHandle,
} from "../gamedata/objects.gen.ts";
import { objectColliders } from "../physics/objectColliders.ts";
import { addVertexData, cloudMeshes, drawMesh, drawObject, incrementObjectIndex } from "../rendering/renderer.ts";
import { createPill } from "../rendering/shapes.ts";

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
	const t0 = performance.now();

	for (const [object, pos] of levelGeometry) {
		drawObject(object, { _: { translation: pos } });
	}

	let seed = 0;
	for (const [y, [xmin, zmin], [xmax, zmax]] of clouds) {
		for (let z = zmin; z <= zmax; z++) {
			for (let x = xmin; x <= xmax; x++) {
				drawMesh(
					cloudMeshes[srand(seed++) % 3]!,
					COLOR_WHITE,
					createMatrix({
						translation: add(
							[x, y, z],
							[0.2 * srandf(seed++), 0.2 * srandf(seed++), 0.2 * srandf(seed++)],
						),
					}),
					1,
					0,
				);

			}
		}

		objectColliders.push({ min: [xmin, y - .5, zmin], max: [xmax, y + .5, zmax] });
		incrementObjectIndex();
	}


	debugWatch("drawLevel", performance.now() - t0);
}
