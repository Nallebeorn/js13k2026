import { COLOR_BLACK, COLOR_LIGHTGREY, COLOR_ORANGE, COLOR_VIOLET, COLOR_WHITE, COLOR_YELLOW } from "./colors.ts";
import type { ObjectDescriptor } from "./objectsSchema.ts";

export default [
	{
		name: "cubeStack",
		nodes: [
			{
				translate: [2, -1, -6],
				color: COLOR_ORANGE,
				euler: [0, 0, 45],
				shape: "box",
				a1: 0.5,
				slotName: "box",
				children: [
					{
						translate: [0, 1, 0],
						shape: "pill",
						bottomRadius: 0.5,
						slotName: "pilly"
					},
				]
			},
		],
	},
	{
		name: "oldScene",
		nodes: [
			{
				slotName: "box1",
				translate: [0, 0, -6],
				color: COLOR_LIGHTGREY,
				shape: "box",
				a1: .4,
				height: 1,
				a2: 1,
				b2: 1,
			},
			{
				slotName: "box2",
				translate: [-.7, -.3, -5],
				color: COLOR_YELLOW,
				shape: "box",
				a1: .4,
				height: 1,
				a2: 1,
				b2: 1,
			},
			{
				slotName: "box3",
				translate: [.8, .5, -4.5],
				color: COLOR_VIOLET,
				shape: "box",
				a1: .4,
				height: 1,
				a2: 1,
				b2: 1,
			},
			{
				slotName: "club",
				translate: [0, 0, -4],
				color: COLOR_WHITE,
				shape: "pill",
				bottomRadius: .5,
				topRadius: .2,
				height: 1,
				children: [
					{
						translate: [0, 1, 0],
						color: COLOR_BLACK,
						shape: "pill",
						bottomRadius: 0.5,
					},
				]
			},
		]
	}
] satisfies ObjectDescriptor[];
