	import { repeat } from "../core/util.ts";
import { COLOR_GREEN, COLOR_RED } from "./colors.ts";
import { CLOOD, CLOUD, NPC, offset, type LevelDescriptor } from "./levelSchema.ts";
import { obj_pillar10, obj_pillar5, obj_unitSphere, obj_cube2x2x1, obj_npc1, obj_pillar16, obj_box3x3 } from "./objects.gen.ts";

export default [
	// * Starting area
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
					[0, 0, 0],
					COLOR_RED + i
				],
			] satisfies LevelDescriptor,
	),
	[NPC, obj_npc1, [-8, 0, -8], 225, "The bifrost has shattered and scattered!"],
	[NPC, obj_npc1, [10, 0, 10], 45, "Please great Neighdall! Find the lost rainbow shards all!", -7],
	[obj_box3x3, [15, 0, -12]],
	[NPC, obj_npc1, [15, 3, -12], 135, "Every shard collected increases your flair.\\nTry pressing JUMP in mid-air!", 1],

	// * First shard (0)
	[CLOOD, 0, [0, 32], [5, 8]],
	[CLOOD, 4, [11, 32], [8, 5]],
	[CLOOD, 8, [5, 42], [15, 5]],
	[obj_pillar16, [0, 8.5, 42], [0, 0, 90]],
	[CLOUD, 8, [-35, 25], [-15, 45]],
	[obj_pillar16, [-19, 8.5, 28]],
	[obj_pillar10, [-33, 8.5, 41], [-90, 0, 0]],
	[obj_pillar5, [-33, 8.5, 28]],
	[CLOOD, 16, [-45, 30], [10, 45]],
	[obj_box3x3, [-43, 16, 50]],
	[obj_box3x3, [-46.5, 16, 49.5], , COLOR_GREEN],
	[obj_box3x3, [-45, 19, 50], , COLOR_GREEN],
	[NPC, obj_npc1, [-49, 16, 15], -135, "You'll need a long gallop-up to make this jump"],
	[obj_pillar16, [-45, 8, -10]],
	[CLOOD, 8, [-45, -10], [3, 3]],
	[obj_pillar16, [-45, 20, -13]],
	[CLOOD, 20, [-45, -13], [3, 3]],
	[obj_pillar16, [-49, 12, -13]],
	[CLOOD, 12, [-49, -13], [3, 3]],
	[obj_pillar16, [-41, 12, -13]],
	[CLOOD, 12, [-41, -13], [3, 3]],
	[CLOOD, 20, [-30, -16], [8, 8]], // shard is on this cloud
	[NPC, obj_npc1, [-28, 20, -19], 135, "See that wasn't so hard, you found the first shard!"],

	// * Path to 1A
	[CLOUD, 0, [40, -10], [60, 0]],
	[obj_box3x3, [55, 0, -8], , COLOR_GREEN],
	[obj_box3x3, [55.2, 3, -7.5], , COLOR_GREEN],

	[CLOOD, 6, [80, 30], [8, 8]],
	[obj_box3x3, [82, 6, 32], , COLOR_GREEN],

	[CLOOD, 0, [80, 80], [3, 3]],
	[obj_pillar16, [80, 0, 80], , COLOR_GREEN],

	[CLOUD, 16, [5, 100], [45, 140]],
	[obj_pillar10, [30, 16, 105], , COLOR_GREEN],
	[obj_pillar10, [40, 16, 115], , COLOR_GREEN],
	[NPC, obj_npc1, [28, 16, 118], -45, "It's a work in progress! Try coming back later!"],
	[NPC, obj_npc1, [30, 16, 135], 0, "We used to kiss every day.\\nNow the rainbow is gone, we're all out of gay!"], // gays
	[NPC, obj_npc1, [32, 16, 135], 0, "We used to kiss every day.\\nNow the rainbow is gone, we're all out of gay!"], // gays

	// * Old test level
	/* ...offset(
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
	),*/
] satisfies LevelDescriptor;
