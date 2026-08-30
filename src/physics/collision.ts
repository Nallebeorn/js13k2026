import { clamp, length, sub, withLength, type Vec3 } from "../core/math.ts";

export interface SphereCollider {
	pos: Vec3,
	r: number,
}

export interface CapsuleCollider {
	centerPosition: Vec3,
	vector: Vec3,
	r: number,
}

export interface BoxCollider {
	min: Vec3,
	max: Vec3,
}


export type Collider = SphereCollider | BoxCollider;

export interface Collision {
	depth: number,
	depenetration: 0 | Vec3,
}

export function penetrateSphereGeneric(pos: Vec3, r: number, b: Collider) {
	return ("r" in b) ? penetrateSphereSphere({pos, r}, b) : penetrateSphereBox({pos, r}, b)
}

export function penetrateSphereSphere(a: SphereCollider, b: SphereCollider) {
	const delta = sub(a.pos, b.pos)
	const depth = Math.max(0, a.r - length(delta) + b.r)
	return {
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
