import type { ObjectDescriptor } from "./objectsSchema.ts";

export default [
	{
		name: "cubeStack",
		nodes: [
			{
				type: "transform",
				translate: [2, 0, 0],
				euler: [0, 0, 45],
				children: [
					{
						type: "shape",
						shape: "box",
						a1: 0.5,
					},
					{
						type: "transform",
						translate: [0, 1, 0],
						children: [
							{
								type: "shape",
								shape: "pill",
								bottomRadius: 0.5,
							},
						],
					},
				],
			},
		],
	},
] satisfies ObjectDescriptor[];
