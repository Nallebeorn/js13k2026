import { time as currentTime } from "../core/time.ts";
import { obj_unicorn, obj_unicorn_headSlot, obj_unicorn_neckSlot, obj_unicorn_tailSlot } from "../gamedata/objects.gen.ts";
import { drawScene, ROOT_SLOT } from "../rendering/renderer.ts";

export const Player = () => (
	{
		x: 0,
		z: -6,
		iam: "Unicorn",

		process() {
			console.log("neigh", this.x, this.z);
			drawScene(obj_unicorn, {
				[ROOT_SLOT]: {
					translation: [this.x, 0, this.z],
					euler: [0, 180 * currentTime, 0],
				},
				[obj_unicorn_neckSlot]: {
					euler: [Math.sin(currentTime * 10) * 15, Math.sin(currentTime * 20) * 20, 0],
				},
				[obj_unicorn_headSlot]: {
					euler: [Math.sin(0.2 + currentTime * 10) * 10, 0, 0],
				},
				[obj_unicorn_tailSlot]: {
					euler: [0, 0, Math.sin(currentTime * 8) * 30]
				}
			})
		},
	}
);
