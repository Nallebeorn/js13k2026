import type { ObjectDescriptor } from "./objectsSchema.ts";

export default [
	{
		name: "cubeStack",
		nodes: [
			{
				type: "shape",
				shape: "box",
				a1: 0.5
			},
			{
				type: "transform",
				translate: [0, -1.5, 0],
				children: [
					{
						type: "shape",
						shape: "pill",
						bottomRadius: 0.75
					}
				]
			}
		]
	}
] satisfies ObjectDescriptor[]
