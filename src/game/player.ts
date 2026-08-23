import { time as currentTime } from "../core/time.ts";
import {
	obj_unicorn,
	obj_unicorn_headSlot,
	obj_unicorn_neckSlot,
	obj_unicorn_tailSlot,
} from "../gamedata/objects.gen.ts";
import { drawScene, ROOT_SLOT } from "../rendering/renderer.ts";

let x = 0;
let z = -6;
let iam = "Unicorn";

export function processPlayer() {
	console.log("neigh", x, z, iam);
	drawScene(obj_unicorn, {
		[ROOT_SLOT]: {
			translation: [x, 0, z],
			euler: [0, 180 * currentTime, 0],
		},
		[obj_unicorn_neckSlot]: {
			euler: [
				Math.sin(currentTime * 10) * 15,
				Math.sin(currentTime * 20) * 20,
				0,
			],
		},
		[obj_unicorn_headSlot]: {
			euler: [Math.sin(0.2 + currentTime * 10) * 10, 0, 0],
		},
		[obj_unicorn_tailSlot]: {
			euler: [0, 0, Math.sin(currentTime * 8) * 30],
		},
	});
}
