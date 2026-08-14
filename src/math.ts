export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];

export type AnyVec = Vec2 | Vec3 | Vec4;

export type Mat4 = [
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
]

export function add<T extends AnyVec>(lhs: T, rhs: NoInfer<T>): T {
	return lhs.map((a, i) => a + rhs[i]!) as T;
}

export function sub<T extends AnyVec>(lhs: T, rhs: NoInfer<T>): T {
	return lhs.map((a, i) => a - rhs[i]!) as T;
}

export function dot<T extends AnyVec>(lhs: T, rhs: NoInfer<T>): number {
	return lhs.reduce((sum, a, i) => sum + a * rhs[i]!, 0);
}

export function length<T extends AnyVec>(vec: T): number {
	return Math.sqrt(dot(vec, vec));
}

export function normalize<T extends AnyVec>(vec: T): T {
	return vec.map(a => a / length(vec)) as T;
}

export function projectPerspective(fovy: number, aspect: number, near: number): Mat4 {
	const f = 1.0 / Math.tan(fovy / 2);
	return [
		f / aspect, 0,  0,				 0,
		0, 					f,  0, 				 0,
		0, 					0, -1,				-1,
		0, 					0, -2 *  near, 0,
	];
}

export function transform(pos?: Vec3, axis?: Vec3, angle?: number): Mat4 {
	const [px, py, pz] = pos ?? [0, 0, 0];

	const [rx, ry, rz] = axis ?? [0, 0, 0];
	const s = Math.sin(angle ?? 0);
	const c = Math.cos(angle ?? 0);
	const t = 1 - c;

	return [
		(rx * rx * t + c),			(ry * rx * t + rz * s),	(rz * rx * t - ry * s),	(0),
		(rx * ry * t - rz * s),	(ry * ry * t + c),			(rz * ry * t + rx * s),	(0),
		(rx * rz * t + ry * s),	(ry * rz * t - rx * s),	(rz * rz * t + c),			(0),
		(px),										(py),										(pz),										(1)
	]
}

export function identityMat4(): Mat4 {
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	];
}
