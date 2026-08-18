import { IDENTITY } from "../core/math.ts";
import type { DrawCommand } from "../rendering/drawCommand.ts";
import { addVertexData } from "../rendering/renderer.ts";
import { createBox, createPill } from "../rendering/shapes.ts";
import { NODE_TYPE_MASK, NODE_TYPE_NEW_OBJECT, NODE_TYPE_COLOR, NODE_TYPE_TRANSFORM, TRANSFORM_FLAGS_MASK, TRANSFORM_FLAGS_TRANSLATE, TRANSFORM_FLAGS_ROTATE, NODE_TYPE_SHAPE, SHAPE_TYPE_MASK, SHAPE_TYPE_BOX, SHAPE_FLAGS_NEW_INDEX, SHAPE_TYPE_PILL } from "./binformatHelpers.ts";
import { dequantizePosition, dequantizeNormal, dequantizeAngle, dequantizeSize } from "./binformatHelpers.ts";


export function deserializeObjects(buffer: ArrayBuffer): DrawCommand[][] {
	const dv = new DataView(buffer);
	let obj!: DrawCommand[];
	const objects: DrawCommand[][] = [];
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
				break;
			}
			if (header & TRANSFORM_FLAGS_TRANSLATE) {
				const x = dv.getInt8(pos++);
				const y = dv.getInt8(pos++);
				const z = dv.getInt8(pos++);
				matrix = matrix.translate(
					dequantizePosition(x),
					dequantizePosition(y),
					dequantizePosition(z)
				);
			}
			if (header & TRANSFORM_FLAGS_ROTATE) {
				const x = dequantizeNormal(dv.getInt8(pos++));
				const y = dequantizeNormal(dv.getInt8(pos++));
				const z = dequantizeNormal(dv.getInt8(pos++));
				const angle = dequantizeAngle(dv.getUint8(pos++));
				matrix = matrix.rotateAxisAngle(x, y, z, angle);
			}
			obj.push({ pushTransform: matrix });
		}
		if (type == NODE_TYPE_SHAPE) {
			if ((header & SHAPE_TYPE_MASK) == SHAPE_TYPE_BOX) {
				const a1 = dequantizeSize(dv.getUint8(pos++));
				const a2 = dequantizeSize(dv.getUint8(pos++));
				const h = dequantizeSize(dv.getUint8(pos++));
				const b1 = dequantizeSize(dv.getUint8(pos++));
				const b2 = dequantizeSize(dv.getUint8(pos++));
				obj.push({
					drawShape: addVertexData(createBox(a1, a2, h, b1, b2)),
					incrementSurfaceIndex: header & SHAPE_FLAGS_NEW_INDEX
				});
			}
			if ((header & SHAPE_TYPE_MASK) == SHAPE_TYPE_PILL) {
				const r1 = dequantizeSize(dv.getUint8(pos++));
				const r2 = dequantizeSize(dv.getUint8(pos++));
				const h = dequantizeSize(dv.getUint8(pos++));
				obj.push({
					drawShape: addVertexData(createPill(r1, r2, h)),
					incrementSurfaceIndex: header & SHAPE_FLAGS_NEW_INDEX
				});
			}
		}
	}

	return objects;
}
