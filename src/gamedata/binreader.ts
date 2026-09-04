import type { BoxCollider, CapsuleCollider, Collider } from "../physics/collision.ts";
import type { DrawCommand } from "../rendering/drawCommand.ts";
import { addVertexData } from "../rendering/renderer.ts";
import { createBox, createPill } from "../rendering/shapes.ts";
import { NODE_TYPE_MASK, NODE_TYPE_NEW_OBJECT, NODE_TYPE_COLOR, NODE_TYPE_TRANSFORM, TRANSFORM_FLAGS_TRANSLATE, TRANSFORM_FLAGS_ROTATE, NODE_TYPE_SHAPE, SHAPE_TYPE_MASK, SHAPE_TYPE_BOX, SHAPE_FLAGS_NEW_INDEX, COLOR_MASK, TRANSFORM_FLAGS_POP, SHAPE_FLAGS_COLLISION } from "./binformatHelpers.ts";
import { dequantizePosition, dequantizeAngle, dequantizeSize } from "./binformatHelpers.ts";
import type { Color } from "./colors.ts";


export function deserializeObjects(buffer: ArrayBuffer): DrawCommand[][] {
	const objects: DrawCommand[][] = [];
	const dv = new DataView(buffer);
	let obj!: DrawCommand[];
	let colliders!: Collider[];

	for (let pos = 0; pos < dv.byteLength;) {
		const header = dv.getUint8(pos++);
		const type = header & NODE_TYPE_MASK;

		if (type == NODE_TYPE_NEW_OBJECT) {
			objects.push(obj = []);
		}

		if (type == NODE_TYPE_COLOR) {
			obj.push({ colour: (header & COLOR_MASK) as Color});
		}

		if (type == NODE_TYPE_TRANSFORM) {
			if (header & TRANSFORM_FLAGS_POP) {
				obj.push({ popTransform: 1 });
			} else {
				obj.push({
					pushTransform: {
						translation: (header & TRANSFORM_FLAGS_TRANSLATE) && [
							dequantizePosition(dv.getInt8(pos++)),
							dequantizePosition(dv.getInt8(pos++)),
							dequantizePosition(dv.getInt8(pos++))
						],
						euler: (header & TRANSFORM_FLAGS_ROTATE) && [
							dequantizeAngle(dv.getUint8(pos++)),
							dequantizeAngle(dv.getUint8(pos++)),
							dequantizeAngle(dv.getUint8(pos++)),
						]
					}
				});
			}
		}

		if (type == NODE_TYPE_SHAPE) {
			if ((header & SHAPE_TYPE_MASK) == SHAPE_TYPE_BOX) {
				const a1 = dequantizeSize(dv.getUint8(pos++))
				const b1 = dequantizeSize(dv.getUint8(pos++))
				const h = dequantizeSize(dv.getUint8(pos++))
				const a2 = dequantizeSize(dv.getUint8(pos++))
				const b2 = dequantizeSize(dv.getUint8(pos++))

				obj.push({
					drawShape: addVertexData(createBox(a1, b1, h, a2, b2)),
					incrementSurfaceIndex: header & SHAPE_FLAGS_NEW_INDEX,
					collider: (header & SHAPE_FLAGS_COLLISION) && {
						min: [Math.min(-a1, -a2), 0, Math.min(-b1, -b2)],
						max: [Math.max(a1, a2), h, Math.max(b1, b2)]
					} satisfies BoxCollider
				});
			} else { // SHAPE_TYPE_PILL
				const r1 = dequantizeSize(dv.getUint8(pos++));
				const r2 = dequantizeSize(dv.getUint8(pos++));
				const h = dequantizeSize(dv.getUint8(pos++));

				obj.push({
					drawShape: addVertexData(createPill(r1, r2, h)),
					incrementSurfaceIndex: header & SHAPE_FLAGS_NEW_INDEX,
					collider: (header & SHAPE_FLAGS_COLLISION) && {
						pos: [0, 0, 0],
						r: Math.max(r1, r2),
						vector: [0, h, 0],
					} satisfies CapsuleCollider
				});
			}
		}
	}

	return objects;
}
