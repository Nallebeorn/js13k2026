import { createMatrix, add } from "../core/math.ts";
import { srandf } from "../core/random.ts";
import { npcs } from "../game/npcs.ts";
import type { BoxCollider, CapsuleCollider } from "../physics/collision.ts";
import { staticColliders } from "../physics/objectColliders.ts";
import type { DrawCommand } from "../rendering/drawCommand.ts";
import { drawMesh, drawObject, incrementObjectIndex } from "../rendering/renderer.ts";
import { createBox, createPill } from "../rendering/shapes.ts";
import { addVertexData, unitSphere } from "../rendering/vertexData.ts";
import {
	NODE_TYPE_MASK,
	NODE_TYPE_NEW_OBJECT,
	NODE_TYPE_COLOR,
	NODE_TYPE_TRANSFORM,
	TRANSFORM_FLAGS_TRANSLATE,
	TRANSFORM_FLAGS_ROTATE,
	NODE_TYPE_SHAPE,
	SHAPE_TYPE_MASK,
	SHAPE_TYPE_BOX,
	SHAPE_FLAGS_NEW_INDEX,
	COLOR_MASK,
	TRANSFORM_FLAGS_POP,
	SHAPE_FLAGS_COLLISION,
	SHAPE_FLAGS_VISIBLE,
	dequantizeBigPosition,
} from "./binformatHelpers.ts";
import { dequantizePosition, dequantizeAngle, dequantizeSize } from "./binformatHelpers.ts";
import { COLOR_WHITE, colors, type Color } from "./colors.ts";
import { dialogue } from "./dialogue.gen.ts";
import { objectsBank } from "./gamedata.ts";
import type { RenderObjectHandle } from "./objects.gen.ts";
import { section_cloudsEnd, section_levelObjectsEnd, section_npcsEnd, section_objectBankEnd, section_paletteEnd } from "./sections.gen.ts";

export function deserializeBinaryGameData(bytes: Uint8Array) {
	let pos = 0;

	// * Read palette
	while (pos < section_paletteEnd) {
		colors.push(bytes[pos++]! / 0xff);
		colors.push(bytes[pos++]! / 0xff);
		colors.push(bytes[pos++]! / 0xff);
		colors.push(1);
	}

	// * Read objects
	let obj!: DrawCommand[];
	while (pos < section_objectBankEnd) {
		const header = bytes[pos++]!;

		const type = header & NODE_TYPE_MASK;

		if (type == NODE_TYPE_NEW_OBJECT) {
			objectsBank.push(obj = []);
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
							dequantizePosition(bytes[pos++]!),
							dequantizePosition(bytes[pos++]!),
							dequantizePosition(bytes[pos++]!)
						],
						euler: (header & TRANSFORM_FLAGS_ROTATE) && [
							dequantizeAngle(bytes[pos++]!),
							dequantizeAngle(bytes[pos++]!),
							dequantizeAngle(bytes[pos++]!),
						]
					}
				});
			}
		}

		if (type == NODE_TYPE_SHAPE) {
			if ((header & SHAPE_TYPE_MASK) == SHAPE_TYPE_BOX) {
				const a1 = dequantizeSize(bytes[pos++]!)
				const b1 = dequantizeSize(bytes[pos++]!)
				const h = dequantizeSize(bytes[pos++]!)
				const a2 = dequantizeSize(bytes[pos++]!)
				const b2 = dequantizeSize(bytes[pos++]!)

				obj.push({
					drawShape: (header & SHAPE_FLAGS_VISIBLE) && addVertexData(createBox(a1, b1, h, a2, b2)),
					incrementSurfaceIndex: header & SHAPE_FLAGS_NEW_INDEX,
					collider: (header & SHAPE_FLAGS_COLLISION) && {
						min: [Math.min(-a1, -a2), 0, Math.min(-b1, -b2)],
						max: [Math.max(a1, a2), h, Math.max(b1, b2)]
					} satisfies BoxCollider
				});
			} else { // SHAPE_TYPE_PILL
				const r1 = dequantizeSize(bytes[pos++]!);
				const r2 = dequantizeSize(bytes[pos++]!);
				const h = dequantizeSize(bytes[pos++]!);

				obj.push({
					drawShape: (header & SHAPE_FLAGS_VISIBLE) && addVertexData(createPill(r1, r2, h)),
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

	// * Read clouds
	let seed = 0;
	while (pos < section_cloudsEnd) {
		const y = dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!);
		const xmin = dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!);
		const zmin = dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!);
		const xmax = dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!);
		const zmax = dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!);

		for (let z = zmin; z <= zmax; z += 0.75) {
			for (let x = xmin; x <= xmax; x += 0.75) {
				drawMesh(
					unitSphere,
					COLOR_WHITE,
					createMatrix({
						translation: add(
							[x, y - .5, z],
							[0.2 * srandf(seed++), 0.2 * srandf(seed++), 0.2 * srandf(seed++)],
						),
						scale: 0.75 + srandf(seed++) * .25
					}),
					1,
					0,
					true,
				);
			}
		}

		staticColliders.push({
			min: [xmin, y - 1, zmin],
			max: [xmax, y, zmax],
			safePoint: [xmin * 0.5 + xmax * 0.5, y+1.5, zmin * 0.5 + zmax * 0.5],
		});
		incrementObjectIndex();
	}

	// * Read NPCs
	let npcIndex = 0;
	while (pos < section_npcsEnd) {
		npcs.push({
			obj: bytes[pos++]! as RenderObjectHandle,
			pos: [
				dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!),
				dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!),
				dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!),
			],
			angle: dequantizeAngle(bytes[pos++]!),
			dialogue: dialogue[npcIndex++]!,
			minShards: (bytes[pos++]! << 24) >> 24,
		})
	}

	// * Read level objects
	while (pos < section_levelObjectsEnd) {
		drawObject(
			bytes[pos++]! as RenderObjectHandle,
			{
				_: {
					translation: [
						dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!),
						dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!),
						dequantizeBigPosition(bytes[pos++]!, bytes[pos++]!),
					],
					euler: [
						dequantizeAngle(bytes[pos++]!),
						dequantizeAngle(bytes[pos++]!),
						dequantizeAngle(bytes[pos++]!),
					],
				}
			},
			bytes[pos++]! || undefined,
			true
		);
	}
}
