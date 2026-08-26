import {
	COLOR_BLACK,
	COLOR_BLUE,
	COLOR_CYAN,
	COLOR_DARKGREY,
	COLOR_GREEN,
	COLOR_LIGHTGREY,
	COLOR_ORANGE,
	COLOR_PEACH,
	COLOR_PINK,
	COLOR_RED,
	COLOR_VIOLET,
	COLOR_WHITE,
	COLOR_YELLOW,
} from "./colors.ts";
import type { ObjectDescriptor, ObjectNode } from "./objectsSchema.ts";

export default [
	{
		// ? unicorn
		name: "unicorn",
		nodes: [
			{
				translate: [0, 0, -.5],
				children: [
					...[-1, 1].flatMap((s): ObjectNode[] => [
						{
							// hind legs
							shape: "pill",
							color: COLOR_WHITE,
							translate: [s * .2, 0, 0],
							euler: [190, 0, 0],
							bottomRadius: 0.5,
							height: 0.7,
							topRadius: 0.2,
							children: [
								{
									shape: "pill",
									euler: [0, 0, 0],
									translate: [0, .7, 0],
									bottomRadius: 0.2,
									height: .2,
									children: [
										{
											shape: "pill",
											translate: [0, 0.2, 0],
											euler: [-20, 0, 0],
											bottomRadius: 0.2,
											height: .4,
											topRadius: 0.1,
											children: [
												{
													shape: "box", // hooves
													translate: [0, 0.4, 0],
													euler: [10, 0, 0],
													color: COLOR_VIOLET,
													a1: 0.2,
													b2: 0.4,
												}
											]
										}
									]
								}
							]
						},
						{
							// fore legs
							shape: "pill",
							color: COLOR_WHITE,
							translate: [s * .2, 0, 1.2],
							euler: [180, 0, 0],
							bottomRadius: 0.2,
							height: 1.0,
							topRadius: 0.1,
							children: [
								{
									shape: "pill",
									translate: [0, 1.0, 0],
									bottomRadius: 0.1,
									height: 0.4,
									topRadius: 0.1,
									children: [
										{
											shape: "box", // hooves
											translate: [0, 0.4, 0],
											color: COLOR_VIOLET,
											a1: 0.2,
											height: 0.2,
											b2: 0.4,
										}
									]
								}
							]
						}
					]),
					{
						shape: "pill", // body
						euler: [90, 0, 0],
						bottomRadius: 0.55,
						topRadius: 0.45,
						height: 1,
						color: COLOR_WHITE,
					},
					{
						translate: [0, 0, 1.2], // neck
						slotName: "neck",
						euler: [45, 0, 0],
						shape: "pill",
						bottomRadius: 0.45,
						topRadius: 0.3,
						height: 1.0,
						children: [
							{
								shape: "pill", // head
								slotName: "head",
								translate: [0, 1, 0],
								euler: [90, 0, 0],
								bottomRadius: 0.3,
								topRadius: 0.2,
								height: 0.75,
								children: [-1, 1].flatMap((s): ObjectNode[] => [
									{
										shape: "pill", // eyes
										translate: [s * (0.3 + 0.01), 0.2, -0.15],
										color: COLOR_VIOLET,
										bottomRadius: 0.05,
									},
									{
										shape: "pill", // ears
										euler: [-120, 0, 0],
										translate: [s * 0.1, 0, 0],
										color: COLOR_WHITE,
										bottomRadius: 0.2,
										height: 0.5,
										topRadius: 0.01,
									}
								]),
							},
							{
								shape: "pill", // horn
								translate: [0, 1.3, 0.1],
								color: COLOR_YELLOW,
								height: 0.8,
								bottomRadius: 0.1,
								topRadius: 0,
								newObjectIndex: true,
							},
							{
								shape: "pill",
								translate: [0, .4, -0.2],
								euler: [15, 0, 0],
								bottomRadius: 0.4,
								topRadius: 0.3,
								height: 0.6,
							}
						],
					},
					{
						shape: "pill", // tail
						slotName: "tail",
						newObjectIndex: true,
						color: COLOR_YELLOW,
						translate: [0, 0.1, -0.5],
						euler: [-170, 0, 0],
						bottomRadius: 0.1,
						height: 1,
						topRadius: 0.2,
					},
				],
			},
		],
	},
	{
		name: "unitSphere",
		nodes: [
			{
				shape: "pill",
				color: COLOR_WHITE,
				bottomRadius: 0.5,
			}
		]
	},
	{
		name: "unitCube",
		nodes: [
			{
				shape: "box",
				color: COLOR_WHITE,
				a1: 1,
			}
		]
	}
] satisfies ObjectDescriptor[];
