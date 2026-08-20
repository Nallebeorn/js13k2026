import type { ObjectNode } from "./objectsSchema.ts";
import objectsData from "./objects.ts";
import {
	quantizePosition,
	quantizeAngle,
	quantizeSize,
	NODE_TYPE_TRANSFORM,
	TRANSFORM_FLAGS_TRANSLATE,
	TRANSFORM_FLAGS_ROTATE,
	NODE_TYPE_SHAPE,
	SHAPE_TYPE_BOX,
	SHAPE_TYPE_PILL,
	SHAPE_FLAGS_NEW_INDEX,
	NODE_TYPE_NEW_OBJECT,
	NODE_TYPE_COLOR,
    TRANSFORM_FLAGS_POP,
} from "./binformatHelpers.ts";

export function serializeObjects(): {
	buffer: ArrayBuffer,
	names: string[],
	slotNames: Record<string, Record<string, number>>
} {
	const objects = objectsData;

	const buffer = new ArrayBuffer(13312);
	const dv = new DataView(buffer);
	const names: string[] = [];
	const slotNames: Record<string, Record<string, number>> = {}
	let pos = 0;

	for (const obj of objects) {
		let transformSlotIndex = 0;
		const serializeNode = (node: ObjectNode) => {
			const hasTransform = node.translate || node.euler || node.slotName;
			if (node.color != undefined) {
				dv.setUint8(pos++, NODE_TYPE_COLOR | node.color);
			}

			if (hasTransform) {
				let byte = NODE_TYPE_TRANSFORM;
				node.translate && (byte |= TRANSFORM_FLAGS_TRANSLATE);
				node.euler && (byte |= TRANSFORM_FLAGS_ROTATE);
				dv.setUint8(pos++, byte);

				if (node.translate) {
					const [x, y, z] = node.translate;
					dv.setInt8(pos++, quantizePosition(x));
					dv.setInt8(pos++, quantizePosition(y));
					dv.setInt8(pos++, quantizePosition(z));
				}

				if (node.euler) {
					const [x, y, z] = node.euler;
					dv.setUint8(pos++, quantizeAngle(x));
					dv.setUint8(pos++, quantizeAngle(y));
					dv.setUint8(pos++, quantizeAngle(z));
				}

				if (node.slotName) {
					(slotNames[obj.name] ??= {})[node.slotName] = transformSlotIndex++;
				}
			}

			if (node.shape) {
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

					dv.setUint8(pos++, quantizeSize(a1 / 2));
					dv.setUint8(pos++, quantizeSize(b1 / 2));
					dv.setUint8(pos++, quantizeSize(h));
					dv.setUint8(pos++, quantizeSize(a2 / 2));
					dv.setUint8(pos++, quantizeSize(b2 / 2));
				}

				if (node.shape == "pill") {
					const r1 = node.bottomRadius;
					const r2 = node.topRadius ?? node.bottomRadius;
					const h = node.height ?? 0;

					dv.setUint8(pos++, quantizeSize(r1));
					dv.setUint8(pos++, quantizeSize(r2));
					dv.setUint8(pos++, quantizeSize(h));
				}
			}

			node.children?.forEach(serializeNode);
			if (hasTransform) {
				dv.setUint8(pos++, NODE_TYPE_TRANSFORM | TRANSFORM_FLAGS_POP);
			}
		};

		dv.setUint8(pos++, NODE_TYPE_NEW_OBJECT);
		names.push(obj.name);
		obj.nodes.forEach(serializeNode);
	}

	return {
		buffer: buffer.slice(0, pos),
		names,
		slotNames
	};
}
