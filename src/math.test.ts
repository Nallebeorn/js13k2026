import { describe, expect, test } from "vitest";
import { add, sub, length, type AnyVec } from "./math.js";

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
