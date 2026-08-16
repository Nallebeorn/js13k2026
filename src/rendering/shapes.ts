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

	// With correct winding order (if backface culling is on)
	const vertices = [
		0, 1, 2, 2, 1, 3, // -X
		0, 4, 1, 1, 4, 5, // -Y
		0, 2, 4, 4, 2, 6, // -Z
		1, 5, 3, 3, 5, 7, // +Z
		2, 3, 6, 6, 3, 7, // +Y
		4, 6, 5, 5, 6, 7, // +X
	];

	return vertices.flatMap((v, i) => [...corners[v]!, i / 6 | 0]);
}

export function createCapsule(radius: number, height: number) {
	const segments = 16;
	const capSegments = 4;

	const vertices: number[] = [];

	function addVertex(r: number, y: number, segment: number) {
		const angle = segment * Math.PI * 2 / segments;

		vertices.push(
			r * Math.cos(angle),
			y,
			r * Math.sin(angle),
			0
		);
	}

	function getRing(index: number): [number, number] {
		if (index <= capSegments) {
			const angle = index * Math.PI / (2 * capSegments);
			return [radius * Math.sin(angle), -height / 2 - radius * Math.cos(angle)];
		} else {
			const angle = (2 * capSegments - index + 1) * Math.PI / (2 * capSegments);
			return [radius * Math.sin(angle), height / 2 + radius * Math.cos(angle)];
		}
	}

	for (let ring = 0; ring < capSegments * 2 + 1; ring++) {
		const bottom = getRing(ring);
		const top = getRing(ring + 1);

		for (let segment = 0; segment < segments; segment++) {
			addVertex(...bottom, segment);
			addVertex(...top, segment);
			addVertex(...top, segment + 1);

			addVertex(...bottom, segment);
			addVertex(...top, segment + 1);
			addVertex(...bottom, segment + 1);
		}
	}

	return vertices;
}
