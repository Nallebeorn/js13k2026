export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];

export type AnyVec = Vec2 | Vec3 | Vec4;

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
