import type { ObjectDescriptor } from "./objectsSchema.ts";

export default [
	{
		name: "cubeStack",
		nodes: [
			{
				translate: [2, -1, 0],
				euler: [0, 0, 45],
				shape: "box",
				a1: 0.5,
				children: [
					{
						translate: [0, 1, 0],
						shape: "pill",
						bottomRadius: 0.5,
					},
				]
			},
		],
	},
] satisfies ObjectDescriptor[];
