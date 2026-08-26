import { clamp, length, sub, withLength, type Vec3 } from "../core/math.ts";

export interface SphereCollider {
	position: Vec3,
	radius: number,
}

export interface BoxCollider {
	min: Vec3,
	max: Vec3,
}

export function penetrateSpheres(a: SphereCollider, b: SphereCollider) {
	const delta = sub(a.position, b.position)
	const depth = Math.max(0, a.radius - length(delta) + b.radius)
	return {
		depth,
		depenetration: withLength(delta, depth)
	};
}

export function penetrateSphereCube(a: SphereCollider, b: BoxCollider) {
	const clamped = a.position.map((v, idx) => clamp(v, b.min[idx]!, b.max[idx]!)) as Vec3;
	const delta = sub(a.position, clamped);
	const depth = Math.max(0, a.radius - length(delta));
	return {
		closest: clamped,
		depth: depth,
		depenetration: withLength(delta, depth),
	};
}
