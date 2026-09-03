import type { Vec3 } from "../core/math.ts";
import {
	obj_unitSphere,
	obj_cube2x2x1,
	obj_cube32x32x1,
	obj_pillar10,
	obj_pillar5,
	type RenderObjectHandle,
} from "../gamedata/objects.gen.ts";
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
	[obj_cube32x32x1,[0, -1, 0]],
	[obj_cube32x32x1,[32, -1, 0]],
	[obj_cube32x32x1,[32, -1, 32]],
	[obj_cube32x32x1,[-32, -1, 0]],
	[obj_cube32x32x1,[-32, -1, -32]],
	[obj_cube32x32x1,[-32, -1, 32]],
	[obj_cube32x32x1,[32, -1, -32]],
	[obj_cube32x32x1,[0, -1, -32]],
	[obj_cube32x32x1,[0, -1, 32]],
];

export function drawLevel() {
	for (const [object, pos] of levelGeometry) {
		drawObject(object, { _: { translation: pos } });
	}
}
