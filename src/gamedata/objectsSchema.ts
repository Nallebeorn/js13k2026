import type { Vec3 } from "../core/math.ts";
import type { Color } from "./colors.ts";

export interface ObjectDescriptor {
	name: string,
	nodes: ObjectNode[],
}

export type ObjectNode = (BaseObjectNode & {shape?: undefined}) | BoxDescriptor | PillDescriptor;

export interface BaseObjectNode {
	color?: Color,
	newObjectIndex?: boolean;
	translate?: Vec3;
	euler?: Vec3,
	children?: ObjectNode[];
};

interface ShapeObjectNode extends BaseObjectNode {
	slotName?: string,
}

interface BoxDescriptor extends ShapeObjectNode {
	shape: "box";
	a1: number;
	b1?: number;
	height?: number;
	a2?: number;
	b2?: number;
}

interface PillDescriptor extends ShapeObjectNode {
	shape: "pill";
	bottomRadius: number;
	topRadius?: number;
	height?: number;
}
