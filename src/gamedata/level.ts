import { repeat } from "../core/util.ts";
import { CLOUD, NPC, offset, type LevelDescriptor } from "./levelSchema.ts";
import { obj_pillar10, obj_pillar5, obj_unitSphere, obj_cube2x2x1, obj_npc1, obj_pillar16 } from "./objects.gen.ts";

export default [
	[CLOUD, 0, [-20, -20], [20, 20]],
	...repeat(7).flatMap(
		(i) =>
			[
				[
					obj_pillar16,
					[
						Math.cos((i / 7) * Math.PI * 2) * 17,
						0,
						Math.sin((i / 7) * Math.PI * 2) * 17,
					],
				],
			] satisfies LevelDescriptor,
	),
	[NPC, obj_npc1, [-8, 0, -8], 225, "The bifrost has shattered and scattered!"],
	[NPC, obj_npc1, [10, 0, 10], 45, "Please great Neighdall! Find the lost rainbow shards all!"],
	...offset(
		[-50, 0, 0],
		[
			[CLOUD, 0, [-15, -15], [5, 5]],
			[CLOUD, 0, [-10, 10], [0, 50]],
			[CLOUD, 0, [-10, -40], [0, -25]],

			[NPC, obj_npc1, [-6, 0, 20], 0, "Hello there!"],
			[obj_pillar10, [-10, 0, -8]],
			[obj_pillar5, [-10, 0, -12]],
			[obj_pillar10, [0, 0, -12], [90, 0, 0]],
			[obj_pillar10, [-5, 0, -15], [-90, 0, 0]],
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
		],
	),
] satisfies LevelDescriptor;
