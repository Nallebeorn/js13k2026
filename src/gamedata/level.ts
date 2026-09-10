	import { repeat } from "../core/util.ts";
import { COLOR_CYAN, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } from "./colors.ts";
import { BALLOON, CLOOD, CLOUD, NPC, offset, SHARD, type LevelDescriptor } from "./levelSchema.ts";
import { obj_pillar10, obj_pillar5, obj_unitSphere, obj_cube2x2x1, obj_npc1, obj_pillar16, obj_box3x3, obj_wall, obj_wallEdge, obj_balloon } from "./objects.gen.ts";

export default [
	// * Starting area
	[CLOUD, 0, [-20, -20], [20, 20], true],
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

	// * Shard 1
	[CLOOD, 0, [0, 32], [5, 8]],
	[CLOOD, 4, [11, 32], [8, 5]],
	[CLOOD, 8, [5, 42], [15, 5], true],
	[obj_pillar16, [0, 8.5, 42], [0, 0, 90]],
	[CLOUD, 8, [-35, 25], [-15, 45], true],
	[obj_pillar16, [-19, 8.5, 28]],
	[obj_pillar10, [-33, 8.5, 41], [-90, 0, 0]],
	[obj_pillar5, [-33, 8.5, 28]],
	[CLOOD, 16, [-45, 30], [10, 45], true],
	[obj_box3x3, [-43, 16, 50]],
	[obj_box3x3, [-46.5, 16, 49.5], , COLOR_GREEN],
	[obj_box3x3, [-45, 19, 50], , COLOR_GREEN],
	[NPC, obj_npc1, [-49, 16, 15], -135, "If you want to make this jump, you'll need a long gallop-up"],
	[obj_pillar16, [-45, 8, -10]],
	[CLOOD, 8, [-45, -10], [3, 3]],
	[obj_pillar16, [-45, 20, -13]],
	[CLOOD, 20, [-45, -13], [3, 3]],
	[obj_pillar16, [-49, 12, -13]],
	[CLOOD, 12, [-49, -13], [3, 3]],
	[obj_pillar16, [-41, 12, -13]],
	[CLOOD, 12, [-41, -13], [3, 3]],

	[CLOOD, 20, [-30, -16], [8, 8], true],
	[SHARD, COLOR_GREEN, [-30, 21, -16]],
	[NPC, obj_npc1, [-28, 20, -19], 135, "See that wasn't so hard, you found the first shard!"],

	// * Path to shard 2
	[CLOUD, 0, [40, -10], [60, 0]],
	[obj_box3x3, [55, 0, -8], , COLOR_GREEN],
	[obj_box3x3, [55.2, 3, -7.5], , COLOR_GREEN],
	[NPC, obj_npc1, [55, 6, -8], 90, "You know what's really exciting?\\nPressing JUMP while rainbow-riding!"],

	[CLOOD, 6, [80, 30], [8, 8], true],
	[obj_box3x3, [82, 6, 32], , COLOR_GREEN],

	[CLOOD, 0, [80, 80], [3, 3]],
	[obj_pillar16, [80, 0, 80], , COLOR_GREEN],

	// * Shard 2
	[CLOUD, 16, [5, 100], [45, 155], true],
	[obj_pillar5, [35, 16, 102], , COLOR_GREEN], // R
	[obj_pillar5, [43, 16, 110], , COLOR_GREEN], // L
	// [NPC, obj_npc1, [28, 16, 118], -45, "It's a work in progress! Try coming back later!"],
	[NPC, obj_npc1, [10, 16, 120], -45, "We used to kiss every day.\\nNow the rainbow is gone, we're all out of gay!"], // gays
	[NPC, obj_npc1, [10.5, 16, 122], -45, "We used to kiss every day.\\nNow the rainbow is gone, we're all out of gay!"], // gays

	[obj_box3x3, [42, 16, 130], , COLOR_GREEN],
	[obj_box3x3, [40, 16, 133.5], , COLOR_YELLOW],
	[obj_box3x3, [41, 19, 132], , COLOR_YELLOW],

	...repeat(7).flatMap(y => [
		[obj_wall, [20, 20 + y * 4, 160]],
		[obj_wall, [26, 20 + y * 4, 160]],
		[obj_wallEdge, [32, 20 + y * 4, 160],],
		[obj_wallEdge, [14, 20 + y * 4, 160], [0, 180, 0]],
	] satisfies LevelDescriptor),
	[BALLOON, [15, 51, 160]],
	[BALLOON, [20, 51, 160]],
	[BALLOON, [25, 51, 160]],
	[BALLOON, [30, 51, 160]],

	[CLOOD, 35, [23, 146], [9, 9], true],
	[CLOOD, 35, [23, 120], [9, 15], true],
	[CLOOD, 35, [23, 90], [9, 25], true],
	[NPC, obj_npc1, [24, 35, 80], 180, "With your new yellow flair you can\\npress JUMP even more times in the air!", 2],

	[CLOOD, 55, [23, 120], [9, 9], true],
	[SHARD, COLOR_YELLOW, [23, 55, 120]],

	// * Path to shard 3
	[CLOOD, 35, [20, -8], [12, 12], true],
	[obj_box3x3, [22, 35, -9], , COLOR_YELLOW],

	// * Shard 3
	...repeat(7).flatMap(y => [
		[obj_wall, [16, 40 + y * 4, -50]],
		[obj_wall, [22, 40 + y * 4, -50]],
		[obj_wallEdge, [28, 40 + y * 4, -50],],
		[obj_wallEdge, [10, 40 + y * 4, -50], [0, 180, 0]],
	] satisfies LevelDescriptor),
	[CLOUD, 40, [10, -51], [28, -49]],

	[CLOOD, 60, [60, -45], [10, 10], true],

	[obj_pillar10, [60, 70, -10], , COLOR_YELLOW],
	[BALLOON, [60, 84, -10]],
	[obj_pillar16, [60, 80, 30], , COLOR_CYAN],
	[BALLOON, [60, 100, 30]],
	[BALLOON, [60, 105, 40]],
	[BALLOON, [60, 110, 50]],
	[CLOOD, 110, [60, 60], [7, 7]],
	[CLOOD, 115, [30, 60], [7, 7], true],
	[SHARD, COLOR_CYAN, [30, 116, 60]],

] satisfies LevelDescriptor;
