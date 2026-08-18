import { IDENTITY } from "../core/math.ts";
import type { DrawCommand } from "../rendering/drawCommand.ts";
import { addVertexData } from "../rendering/renderer.ts";
import { createBox, createPill } from "../rendering/shapes.ts";
import { NODE_TYPE_MASK, NODE_TYPE_NEW_OBJECT, NODE_TYPE_COLOR, NODE_TYPE_TRANSFORM, TRANSFORM_FLAGS_MASK, TRANSFORM_FLAGS_TRANSLATE, TRANSFORM_FLAGS_ROTATE, NODE_TYPE_SHAPE, SHAPE_TYPE_MASK, SHAPE_TYPE_BOX, SHAPE_FLAGS_NEW_INDEX, SHAPE_TYPE_PILL } from "./binformatHelpers.ts";
import { dequantizePosition, dequantizeAngle, dequantizeSize } from "./binformatHelpers.ts";


export function deserializeObjects(buffer: ArrayBuffer): DrawCommand[][] {
	const objects: DrawCommand[][] = [];
	const dv = new DataView(buffer);
	let obj!: DrawCommand[];
	let pos = 0;
	while (pos < dv.byteLength) {
		const header = dv.getUint8(pos++);
		const type = header & NODE_TYPE_MASK;
		if (type == NODE_TYPE_NEW_OBJECT) {
			objects.push(obj = []);
		}
		if (type == NODE_TYPE_COLOR) {
			obj.push({ color: [1, 1, 1, 1] }); // TODO
		}
		if (type == NODE_TYPE_TRANSFORM) {
			let matrix = IDENTITY;
			if ((header & TRANSFORM_FLAGS_MASK) == 0) {
				obj.push({ popTransform: 1 });
			} else {
				if (header & TRANSFORM_FLAGS_TRANSLATE) {
					matrix = matrix.translate(
						dequantizePosition(dv.getInt8(pos++)),
						dequantizePosition(dv.getInt8(pos++)),
						dequantizePosition(dv.getInt8(pos++))
					);
				}
				if (header & TRANSFORM_FLAGS_ROTATE) {
					matrix = matrix.rotate(
						dequantizeAngle(dv.getUint8(pos++)),
						dequantizeAngle(dv.getUint8(pos++)),
						dequantizeAngle(dv.getUint8(pos++)),
					);
				}
				obj.push({ pushTransform: matrix });
			}
		}
		if (type == NODE_TYPE_SHAPE) {
			obj.push((header & SHAPE_TYPE_MASK) == SHAPE_TYPE_BOX
				? {
					drawShape: addVertexData(createBox(
						dequantizeSize(dv.getUint8(pos++)),
						dequantizeSize(dv.getUint8(pos++)),
						dequantizeSize(dv.getUint8(pos++)),
						dequantizeSize(dv.getUint8(pos++)),
						dequantizeSize(dv.getUint8(pos++)),
					)),
					incrementSurfaceIndex: header & SHAPE_FLAGS_NEW_INDEX
				}
				: { // ? SHAPE_TYPE_PILL
					drawShape: addVertexData(createPill(
						dequantizeSize(dv.getUint8(pos++)),
						dequantizeSize(dv.getUint8(pos++)),
						dequantizeSize(dv.getUint8(pos++)),
					)),
					incrementSurfaceIndex: header & SHAPE_FLAGS_NEW_INDEX
				}
			);
		}
	}

	return objects;
}
