import { expect, suite, test } from "vitest";
import { quantizePosition, quantizeNormal, quantizeAngle } from "./binwriter.ts";

suite("binwriter", () => {
	suite("quantizePosition", () => {
		const testCases: [number, number][] = [
			[0, 0],
			[-16, -127],
			[16, 127],
			[0.1, 1],
			[-0.1, -1],
			[17, 127],
			[-17, -127],
			[100, 127],
			[-100, -127]
		]

		testCases.forEach(([input, expected]) => {
			test(`quantizePosition(${input}) = ${expected}`, () => {
				expect(quantizePosition(input)).toBe(expected);
			});
		});
	});

	suite("quantizeNormal", () => {
		const testCases: [number, number][] = [
			[0, 0],
			[-1, -127],
			[1, 127],
			[1.5, 127],
			[-1.5, -127],
			[0.25, 32],
			[-0.25, -32]
		]

		testCases.forEach(([input, expected]) => {
			test(`quantizeNormal(${input}) = ${expected}`, () => {
				expect(quantizeNormal(input)).toBe(expected);
			});
		});
	});

	suite("quantizeAngle", () => {
		const testCases: [number, number][] = [
			[0, 0],
			[180, 128],
			[-180, 128],
			[90, 64],
			[-90, 192],
			[360, 0],
			[359, 255]
		]

		testCases.forEach(([input, expected]) => {
			test(`quantizeAngle(${input}) = ${expected}`, () => {
				expect(quantizeAngle(input)).toBe(expected);
			});
		});
	});
});
