import { repeat } from "../core/util.ts";
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
	COLOR_RAINBOW,
	COLOR_RED,
	COLOR_VIOLET,
	COLOR_WHITE,
	COLOR_YELLOW,
} from "./colors.ts";
import type { ObjectDescriptor, ObjectNode } from "./objectsSchema.ts";

const side = (s: number) => (s < 0 ? "R" : "L");

export default [
	{
		// ? unicorn
		name: "unicorn",
		nodes: [
			{
				translate: [0, 0, 1.5],
				slotName: "hornPivot",
				children: [
					{
						translate: [0, 0, -2.5],
						slotName: "body",
						children: [
							...[-1, 1].flatMap((s): ObjectNode[] => [
								{
									// hind legs
									shape: "pill",
									color: COLOR_WHITE,
									translate: [s * 0.2, 0, 0],
									euler: [190, 0, 0],
									bottomRadius: 0.5,
									height: 0.7,
									topRadius: 0.2,
									slotName: "hindLeg" + side(s),
									children: [
										{
											shape: "pill",
											euler: [0, 0, 0],
											translate: [0, 0.7, 0],
											bottomRadius: 0.2,
											height: 0.2,
											slotName: "hindKnee" + side(s),
											children: [
												{
													shape: "pill",
													translate: [0, 0.2, 0],
													euler: [-20, 0, 0],
													bottomRadius: 0.2,
													height: 0.4,
													topRadius: 0.1,
													slotName: "hindHeel" + side(s),
													children: [
														{
															shape: "box", // hooves
															translate: [0, 0.4, 0],
															euler: [10, 0, 0],
															color: COLOR_DARKGREY,
															a1: 0.2,
															b2: 0.4,
														},
													],
												},
											],
										},
									],
								},
								{
									// fore legs
									shape: "pill",
									color: COLOR_WHITE,
									translate: [s * 0.2, 0, 1.2],
									euler: [180, 0, 0],
									bottomRadius: 0.2,
									height: 1.0,
									topRadius: 0.1,
									slotName: "foreLeg" + side(s),
									children: [
										{
											shape: "pill",
											translate: [0, 1.0, 0],
											bottomRadius: 0.1,
											height: 0.4,
											topRadius: 0.1,
											slotName: "foreLegBow" + side(s),
											children: [
												{
													shape: "box", // hooves
													translate: [0, 0.4, 0],
													color: COLOR_DARKGREY,
													a1: 0.2,
													height: 0.2,
													b2: 0.4,
												},
											],
										},
									],
								},
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
												color: COLOR_DARKGREY,
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
											},
										]),
									},
									{
										shape: "pill", // horn
										translate: [0, 1.3, 0.1],
										color: COLOR_RAINBOW,
										height: 0.8,
										bottomRadius: 0.1,
										topRadius: 0,
										newObjectIndex: true,
									},
									{
										shape: "pill", // mane
										translate: [0, 0.4, -0.2],
										euler: [15, 0, 0],
										bottomRadius: 0.4,
										topRadius: 0.3,
										height: 0.6,
									},
								],
							},
							{
								shape: "pill", // tail
								slotName: "tail",
								newObjectIndex: true,
								color: COLOR_RAINBOW,
								translate: [0, 0.1, -0.5],
								euler: [-170, 0, 0],
								bottomRadius: 0.1,
								height: 0.33,
								topRadius: 0.2,
								children: [
									{
										shape: "pill",
										slotName: "tail2",
										translate: [0, 0.33, 0],
										bottomRadius: 0.2,
										height: 0.33,
										children: [
											{
												shape: "pill",
												slotName: "tail3",
												translate: [0, 0.33, 0],
												bottomRadius: 0.2,
												height: 0.33,
												topRadius: 0.1,
											},
										],
									},
								],
							},
						],
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
			},
		],
	},
	{
		name: "unitCube",
		nodes: [
			{
				shape: "box",
				color: COLOR_WHITE,
				a1: 1,
			},
		],
	},
	{
		name: "cube2x2x1",
		nodes: [
			{
				shape: "box",
				color: COLOR_WHITE,
				a1: 2,
				b1: 2,
				height: 1,
				collision: true,
			},
		],
	},
	{
		name: "cube32x32x1",
		nodes: [
			{
				shape: "box",
				color: COLOR_WHITE,
				a1: 32,
				height: 1,
				collision: true,
			},
		],
	},
	{
		name: "pillar10", // ? pillar10
		nodes: [
			...repeat(16).map((i): ObjectNode => ({
				euler: [0, (360 * i) / 16, 0],
				children: [
					{
						shape: "pill",
						newObjectIndex: true,
						color: COLOR_WHITE,
						bottomRadius: 0.25,
						height: 10,
						translate: [0, 0, 1],
					},
				],
			})),
			{ // todo: remove?
				shape: "pill",
				bottomRadius: 1.125,
				height: 10,
				collision: true
			},
			{
				translate: [0, -.5, 0],
				shape: "box",
				a1: 4,
				height: .75,
				a2: 3,
				collision: true,
			},
			{
				translate: [0, 10, 0],
				shape: "box",
				a1: 3,
				height: .75,
				a2: 4,
				collision: true,
			}
		],
	},
	{
		name: "pillar5",
		nodes: [
			...Array.from({ length: 16 }, (_, i): ObjectNode => ({
				euler: [0, (360 * i) / 16, 0],
				children: [
					{
						shape: "pill",
						newObjectIndex: true,
						color: COLOR_WHITE,
						bottomRadius: 0.25,
						height: 5,
						translate: [0, 0, 1],
					},
				],
			})),
			{
				translate: [0, -.5, 0],
				shape: "box",
				a1: 4,
				height: .75,
				a2: 3,
				collision: true,
			},
			{
				translate: [0, 5, 0],
				shape: "box",
				a1: 3,
				height: .75,
				a2: 4,
				collision: true,
			}
		],
	}
] satisfies ObjectDescriptor[];
