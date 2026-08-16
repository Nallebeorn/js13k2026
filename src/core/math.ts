export const TAU = Math.PI * 2;
export const IDENTITY = new DOMMatrixReadOnly();

export function degtorad(degrees: number) {
	return degrees * Math.PI / 180;
}

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

export function getForward(transform: DOMMatrix): Vec3 {
	return [
		-transform.m31,
		-transform.m32,
		-transform.m33,
	]
}

export function normalize<T extends AnyVec>(vec: T): T {
	return vec.map(a => a / length(vec)) as T;
}

export function projectPerspective(fovyFactor: number, aspect: number, near: number): Mat4 {
	const f = fovyFactor;
	return [
		f / aspect, 0,  0,				 0,
		0, 					f,  0, 				 0,
		0, 					0, -1,				-1,
		0, 					0, -2 *  near, 0,
	];
}

export function identityMat4(): Mat4 {
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	];
}
