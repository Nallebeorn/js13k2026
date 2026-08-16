import type { Vec3 } from "../core/math.ts";

export interface ObjectDescriptor {
	name: string,
	nodes: ObjectNode[],
}

type ObjectNode = ShapeDescriptor | Transform;

interface Transform {
	type: "transform";
	translate?: Vec3;
	axis?: Vec3;
	angle?: number;
	children: ObjectNode[];
}

type ShapeDescriptor = {
	type: "shape";
	newObjectIndex?: boolean;
} & (BoxDescriptor | PillDescriptor);

interface BoxDescriptor {
	shape: "box";
	a1: number;
	b1?: number;
	height?: number;
	a2?: number;
	b2?: number;
}

interface PillDescriptor {
	shape: "pill";
	bottomRadius: number;
	topRadius?: number;
	height?: number;
}
