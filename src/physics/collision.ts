import { add, clamp, dot, length, scale, sub, withLength, type Vec3 } from "../core/math.ts";

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

export function penetrateCapsuleGeneric(
	centerPosition: Vec3, vector: Vec3, r: number, b: Collider
) {
	if ("r" in b) {
		return penetrateCapsuleSphere({ centerPosition, vector, r }, b);
	}
	return penetrateCapsuleBox({ centerPosition, vector, r }, b);
}

export function penetrateSphereSphere(a: SphereCollider, b: SphereCollider) {
	const delta = sub(a.pos, b.pos)
	const depth = Math.max(0, a.r - length(delta) + b.r)
	return {
		depth,
		depenetration: depth && withLength(delta, depth)
	};
}

export function penetrateCapsuleSphere(a: CapsuleCollider, b: SphereCollider) {
	const cap1 = sub(a.centerPosition, a.vector);
	let t
		= dot(sub(b.pos, cap1), scale(a.vector, 2))
		/ dot(scale(a.vector, 2), scale(a.vector, 2));
	t = t < 0 ? 0 : (t > 1 ? 1 : t);
	const pos = add(cap1, scale(a.vector, t*2));
	return {
		projected: pos,
		...penetrateSphereSphere({ pos, r: a.r }, b)
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

export function penetrateCapsuleBox(a: CapsuleCollider, b: BoxCollider) {
	const cap1 = sub(a.centerPosition, a.vector);
	const cap2 = add(a.centerPosition, a.vector);

	// obviously not generically accurate
	return [
		{ pos: cap1, r: a.r },
		// { pos: a.centerPosition, r: a.r },
		{ pos: cap2, r: a.r },
	].reduce((deepest, current): Collision => {
			const collision = penetrateSphereBox(current, b);
			return collision.depth > deepest.depth ? collision : deepest;
		}, { depth: 0, depenetration: 0 });
}
