import type { Vec3 } from "../core/math.ts";

export interface ObjectDescriptor {
	name: string,
	nodes: ObjectNode[],
}

export type ObjectNode = (BaseObjectNode & {shape: undefined}) | BoxDescriptor | PillDescriptor;

export interface BaseObjectNode {
	newObjectIndex?: boolean;
	translate?: Vec3;
	euler?: Vec3,
	children?: ObjectNode[];
};

interface BoxDescriptor extends BaseObjectNode {
	shape: "box";
	a1: number;
	b1?: number;
	height?: number;
	a2?: number;
	b2?: number;
}

interface PillDescriptor extends BaseObjectNode {
	shape: "pill";
	bottomRadius: number;
	topRadius?: number;
	height?: number;
}
