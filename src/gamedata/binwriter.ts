import type { ObjectNode } from "./objectsSchema.ts";
import objectsData from "./objects.ts";
import levelData from "./level.ts";
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
	SHAPE_FLAGS_COLLISION,
	SHAPE_FLAGS_VISIBLE,
	NEXT_SECTION_MARKER,
	quantizeBigPosition,
} from "./binformatHelpers.ts";
import { CLOUD } from "./levelSchema.ts";
import { COLOR_COUNT, palette } from "./colors.ts";

export function serializeObjects(): {
	buffer: ArrayBuffer,
	names: string[],
	slotNames: Record<string, Record<string, number>>
} {
	const objects = objectsData;

	const buffer = new ArrayBuffer(13 * 1024);
	const dv = new DataView(buffer);
	let pos = 0;

	// * Write palette
	for (let i = 0; i < COLOR_COUNT; i++) {
		const hex = palette[i]!;
		[hex >> 16, (hex & 0x00ff00) >> 8, hex & 0xff].forEach(
			colorComponent => dv.setUint8(pos++, colorComponent)
		);
	}

	// * Write objects
	const objectNames: string[] = [];
	const slotNames: Record<string, Record<string, number>> = {}

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
					(slotNames[obj.name] ??= {})[node.slotName] = transformSlotIndex;
				}
				transformSlotIndex++;
			}

			if (node.shape) {
				let byte = NODE_TYPE_SHAPE;
				if (node.shape == "box") byte |= SHAPE_TYPE_BOX;
				if (node.shape == "pill") byte |= SHAPE_TYPE_PILL;
				if (node.newObjectIndex) byte |= SHAPE_FLAGS_NEW_INDEX;
				if (node.collision) byte |= SHAPE_FLAGS_COLLISION;
				if (node.visible ?? true) byte |= SHAPE_FLAGS_VISIBLE;
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
		objectNames.push(obj.name);
		obj.nodes.forEach(serializeNode);
	}

	// * Write clouds
	dv.setUint8(pos++, NEXT_SECTION_MARKER);
	for (const node of levelData) {
		if (node[0] === CLOUD) {
			const [, y, min, max] = node;
			dv.setInt16(pos++, quantizeBigPosition(y));
			pos++;
			dv.setInt16(pos++, quantizeBigPosition(min[0]));
			pos++;
			dv.setInt16(pos++, quantizeBigPosition(min[1]));
			pos++;
			dv.setInt16(pos++, quantizeBigPosition(max[0]));
			pos++;
			dv.setInt16(pos++, quantizeBigPosition(max[1]));
			pos++;
		}
	}

	// * Write level objects
	dv.setUint8(pos++, NEXT_SECTION_MARKER);
	for (const node of levelData) {
		if (node[0] !== CLOUD) {
			const [obj, translation, euler] = node;
			dv.setUint8(pos++, obj);
			dv.setInt16(pos++, quantizeBigPosition(translation[0]));
			pos++;
			dv.setInt16(pos++, quantizeBigPosition(translation[1]));
			pos++;
			dv.setInt16(pos++, quantizeBigPosition(translation[2]));
			pos++;
			dv.setUint8(pos++, quantizeAngle(euler?.[0] ?? 0));
			dv.setUint8(pos++, quantizeAngle(euler?.[1] ?? 0));
			dv.setUint8(pos++, quantizeAngle(euler?.[2] ?? 0));
		}
	}


	return {
		buffer: buffer.slice(0, pos),
		names: objectNames,
		slotNames
	};
}
