import "geometry-interfaces"; // polyfill DOMMatrix

import { normalize } from "../core/math.ts";
import type { ObjectDescriptor, ObjectNode } from "./objectsSchema.ts";
import objectsData from "./objects.ts";

export const NODE_TYPE_NEW_OBJECT = 0 << 6;
export const NODE_TYPE_TRANSFORM = 1 << 6;
export const NODE_TYPE_COLOR = 2 << 6;
export const NODE_TYPE_SHAPE = 3 << 6;
export const NODE_TYPE_MASK = NODE_TYPE_SHAPE;

export const TRANSFORM_FLAGS_TRANSLATE = 1 << 5;
export const TRANSFORM_FLAGS_ROTATE = 1 << 4;

export const SHAPE_TYPE_BOX = 0 << 5;
export const SHAPE_TYPE_PILL = 1 << 5;
export const SHAPE_TYPE_MASK = SHAPE_TYPE_PILL;

export const SHAPE_FLAGS_NEW_INDEX = 1 << 4;

export function quantizePosition(float: number) {
	const normalized = Math.min(Math.max(float / 16, -1), 1);
	return Math.round(normalized * 127);
}

export function quantizeNormal(float: number) {
	const clamped = Math.min(Math.max(float, -1), 1);
	return Math.round(clamped * 127);
}

export function quantizeAngle(float: number) {
	const normalized = (float < 0 ? 360 + float : float) / 360;
	return Math.round((normalized * 256) % 256);
}

export function serializeObjects() {
	const objects = objectsData;

	const buffer = new ArrayBuffer(13312);
	const dv = new DataView(buffer);
	let pos = 0;

	const serializeNode = (node: ObjectNode) => {
		switch (node.type) {
			case "transform": {
				let byte = NODE_TYPE_TRANSFORM;
				node.translate && (byte |= TRANSFORM_FLAGS_TRANSLATE);
				node.axis && node.angle && (byte |= TRANSFORM_FLAGS_ROTATE);
				dv.setUint8(pos++, byte);

				if (node.translate) {
					const [x, y, z] = node.translate;
					dv.setUint8(pos++, quantizePosition(x));
					dv.setUint8(pos++, quantizePosition(y));
					dv.setUint8(pos++, quantizePosition(z));
				}

				if (node.angle && node.axis) {
					const normalVector = normalize(node.axis);
					const [x, y, z] = normalVector;
					dv.setUint8(pos++, quantizeNormal(x));
					dv.setUint8(pos++, quantizeNormal(y));
					dv.setUint8(pos++, quantizeNormal(z));
				}

				node.children.forEach(serializeNode);

				dv.setUint8(pos++, NODE_TYPE_TRANSFORM); // pop transform
			} break;

			case "shape": {
				let byte = NODE_TYPE_SHAPE;
				node.shape == "box" && (byte |= SHAPE_TYPE_BOX);
				node.shape == "pill" && (byte |= SHAPE_TYPE_PILL);
				node.newObjectIndex && (byte |= SHAPE_FLAGS_NEW_INDEX);
				dv.setUint8(pos++, byte);

				if (node.shape == "box") {
					const a1 = node.a1;
					const a2 = node.a2 ?? node.a1;
					const h = node.height ?? node.a1;
					const b1 = node.b1 ?? node.a1;
					const b2 = node.b2 ?? node.a2 ?? node.a1;

					dv.setUint8(pos++, quantizePosition(a1));
					dv.setUint8(pos++, quantizePosition(a2));
					dv.setUint8(pos++, quantizePosition(h));
					dv.setUint8(pos++, quantizePosition(b1));
					dv.setUint8(pos++, quantizePosition(b2));
				}

				if (node.shape == "pill") {
					const r1 = node.bottomRadius;
					const r2 = node.topRadius ?? node.bottomRadius;
					const h = node.height ?? 0;

					dv.setUint8(pos++, quantizePosition(r1));
					dv.setUint8(pos++, quantizePosition(r2));
					dv.setUint8(pos++, quantizePosition(h));
				}
			} break;
		}
	};

	for (const obj of objects) {
		dv.setUint8(pos++, NODE_TYPE_NEW_OBJECT);
		obj.nodes.forEach(serializeNode);
	}

	return buffer.slice(0, pos);
}
