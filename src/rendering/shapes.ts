export function createPlane() {
	return [1.0, 1.0, 0, -1.0, 1.0, 0,  1.0, -1.0, 0, -1.0, -1.0, 0];
}

export function createCube() {
	const s = .5;
	const corners = [
		[-s, -s, -s],
		[-s, -s, s],
		[-s, s, -s],
		[-s, s, s],
		[s, -s, -s],
		[s, -s, s],
		[s, s, -s],
		[s, s, s],
	];

	const vertices = [
		0, 1, 2, 1, 3, 2, // -X
		0, 4, 1, 1, 4, 5, // -Y
		0, 2, 4, 2, 6, 4, // -Z
		1, 5, 3, 3, 5, 7, // +Z
		2, 3, 6, 3, 7, 6, // +Y
		4, 6, 5, 5, 6, 7, // +X
	];

	return vertices.flatMap(v => corners[v]!);
}
