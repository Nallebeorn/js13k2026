import { beforeAll, describe, expect, test } from "vitest";
import { add, sub, length, type AnyVec, projectPerspective, type Vec3, normalize, transform } from "./math.js";
import { glMatrix, mat4 } from "gl-matrix";

describe("math", () => {
	describe("vectors", () => {
		describe("add", () => {
			const testCases: [AnyVec, AnyVec, AnyVec][] =
				[
					[[1, 2, 3], [1, 2, 3], [2, 4, 6]],
					[[0, -1, 0.25], [0, -10, 0.25], [0, -11, 0.5]],
					[[0, -1], [0, -10], [0, -11]],
					[[0, -1, 0.25, 4], [0, -10, 0.25, -4], [0, -11, 0.5, 0]],
				];


			testCases.forEach(([lhs, rhs, expected]) => {
				test(`[${lhs}] + [${rhs}] = [${expected}]`, () => {
					expect(add(lhs, rhs)).toStrictEqual(expected);
				});
			});

			() => { // type tests
				//@ts-expect-error
				add([1, 2], [1, 3, 4]);
				//@ts-expect-error
				add([1], [1]);
				//@ts-expect-error
				add([], []);
				//@ts-expect-error
				add([1, 2, 3, 4], [1, 2, 3]);
				//@ts-expect-error
				add(["1", "2"], ["1", "2"]);
			};
		});

		describe("sub", () => {
			const testCases: [AnyVec, AnyVec, AnyVec][] =
				[
					[[1, 2, 6], [1, 2, 3], [0, 0, 3]],
					[[0, -1, 0.75], [0, -10, 0.25], [0, 9, 0.5]],
					[[0, -1], [0, -10], [0, 9]],
					[[0, -1, 0.75, 4], [0, -10, 0.25, -4], [0, 9, 0.5, 8]],
				];


			testCases.forEach(([lhs, rhs, expected]) => {
				test(`[${lhs}] - [${rhs}] = [${expected}]`, () => {
					expect(sub(lhs, rhs)).toStrictEqual(expected);
				});
			});

			() => { // type tests
				//@ts-expect-error
				sub([1, 2], [1, 3, 4]);
				//@ts-expect-error
				sub([1], [1]);
				//@ts-expect-error
				sub([], []);
				//@ts-expect-error
				sub([1, 2, 3, 4], [1, 2, 3]);
				//@ts-expect-error
				sub(["1", "2"], ["1", "2"]);
			};
		});

		describe("length", () => {
			const testCases: [AnyVec, number][] =
				[
					[[1, 1], Math.SQRT2],
					[[0.5, 0.5], Math.SQRT1_2],
					[[1, 0, 1], Math.SQRT2],
					[[0.5, 0.5, 0.5, 0.5], 1],
					[[1, 1, 1], Math.sqrt(3)],
					[[1, -1], Math.SQRT2],
					[[-0.5, 0.5], Math.SQRT1_2],
					[[-1, 1, 0], Math.SQRT2],
					[[-0.5, -0.5, 0.5, -0.5], 1],
				];

			testCases.forEach(([vec, expected]) => {
				test(`|[${vec}]| = ${expected}`, () => {
					expect(length(vec)).toStrictEqual(expected);
				})
			});

			() => { // type tests
				//@ts-expect-error
				length([]);
				//@ts-expect-error
				length([1]);
				//@ts-expect-error
				length([1, 2, 3, 4, 5]);
				//@ts-expect-error
				length(["1", "2"]);
			}
		});
	});

	describe("matrices", () => {
		beforeAll(() => {
			glMatrix.ARRAY_TYPE = Array;
		});

		describe("projectPerspective", () => {
			const testCases: [number, number, number][] = [
				[Math.PI / 4, 640 / 480, 0.1]
			]

			testCases.forEach((args) => {
				test(`${args}`, () => {
					const [fovy, aspect, near] = args;
					const mine = projectPerspective(fovy, aspect, near)
					const expected = mat4.perspective(mat4.create(), fovy, aspect, near, Infinity);
					expect(mine).toStrictEqual(expected);
				});
			})
		})

		describe("transform", () => {
			const testCases: { pos?: Vec3, rot?: [axis: Vec3, angle: number] }[] = [
				{ rot: [[0, 0, 1], 0], pos: [0, 0, -6] },
				{ rot: [[0, 0, 1], Math.PI], pos: [37, 2, -12] },
				{ rot: [[0, 0, 1], Math.PI * 2], pos: [0.3, Math.PI, -100000] },
				{ rot: [[0, 0, 1], Math.PI * 3] },
				{ rot: [[0, 0, 1], -Math.PI * 4] },
				{ rot: [[0, 1, 0], 42] },
				{ rot: [[1, 0, 0], 42] },
				{ rot: [[0, -1, 1], 47] },
				{ rot: [[1, -0.4, -3], 47] },
			];

			testCases.forEach((args) => {
				test(`${JSON.stringify(args)}`, () => {
					const [axis, angle] = args.rot ?? [undefined, undefined];
					const mine = transform(args.pos, axis && normalize(axis), angle);

					const expected = mat4.create();
					args.pos && mat4.fromTranslation(expected, args.pos);
					axis && angle && mat4.rotate(expected, expected, angle, axis);

					mine.forEach((m, idx) => {
						expect(m, `${idx}`).toBeCloseTo(expected[idx]!);
					});
				});
			});
		});
	});
});
