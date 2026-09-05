import { add, clamp, dot, length, scale, sub, withLength, type Vec3 } from "../core/math.ts";

export interface SphereCollider {
	pos: Vec3,
	r: number,
	vector?: undefined,
}

export interface CapsuleCollider {
	pos: Vec3,
	vector: Vec3,
	r: number,
}

export interface BoxCollider {
	min: Vec3,
	max: Vec3,
}

export function translateCollider<T extends Collider>(collider: T, pos: Vec3): T {
	return "r" in collider
		? ({ pos: add(collider.pos, pos), r: collider.r, vector: collider.vector } as T)
		: ({ min: add(collider.min, pos), max: add(collider.max, pos) } as T);
}

export type Collider = BoxCollider | CapsuleCollider;

export interface Collision {
	depth: number,
	depenetration: 0 | Vec3,
}

export function penetrateSphereGeneric(pos: Vec3, r: number, b: Collider) {
	if ("r" in b) {
		return penetrateSphereCapsule({ pos, r }, b as CapsuleCollider)
	}

	return penetrateSphereBox({ pos, r }, b);
}

export function penetrateSphereCapsule(a: SphereCollider, b: CapsuleCollider) {
	const pos = add(
		b.pos,
		scale(
			b.vector,
			clamp(dot(sub(a.pos, b.pos), b.vector) / dot(b.vector, b.vector), 0, 1),
		),
	);
	const delta = sub(a.pos, pos)
	const depth = Math.max(0, a.r - length(delta) + b.r)

	return {
		projected: pos,
		depth,
		depenetration: depth && withLength(delta, depth)
	};
}

export function penetrateSphereBox(a: SphereCollider, b: BoxCollider) {
	const clamped = a.pos.map((v, idx) => clamp(v, b.min[idx]!, b.max[idx]!)) as Vec3;
	const delta = sub(a.pos, clamped);
	const depth = Math.max(0, a.r - length(delta));
	return {
		// closest: clamped,
		depth: depth,
		depenetration: depth && withLength(delta, depth),
	};
}
