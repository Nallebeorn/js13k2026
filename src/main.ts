import { advanceTime } from "./core/time.ts";
import { average, ringPush } from "./core/util.ts";
import { DEBUG, debugWatch } from "./debug.ts";
import { say } from "./game/dialogue.ts";
import { processFrame } from "./game/game.ts";
import { clearFrameInputs } from "./input/input.ts";
import { finishFrame, setupFrame } from "./rendering/renderer.ts";

if (DEBUG) {
	console.log("ℹ️ DEBUG BUILD");
	debugWatch("FPS", "-");
	debugWatch("ms", "-");
}

let previouseFrameTimestamp = 0;
let timerAccumulator = 0;

const fpsValues: number[] = [];
const frameTimeValues: number[] = [];
let framesRendered = 0;

requestAnimationFrame(onAnimationFrame);

say("");

let seed = 0;

function onAnimationFrame(timestamp: number) {
	requestAnimationFrame(onAnimationFrame);

	const elapsed = timestamp - previouseFrameTimestamp || timestamp;
	previouseFrameTimestamp = timestamp;
	timerAccumulator += elapsed;

	if (timerAccumulator >= 1000 / 60) {
		const t0 = (DEBUG && performance.now()) as number;
		timerAccumulator = 0;
		// console.log("random number", srandf(seed++));

		setupFrame();
		processFrame();
		finishFrame();
		advanceTime();
		clearFrameInputs();
		if (DEBUG) {
			const fps = 1000 / elapsed;
			const t1 = performance.now();
			ringPush(frameTimeValues, t1 - t0, 20);
			if (framesRendered++ % 10 == 0) {
				debugWatch("FPS", Math.round(fps));
				debugWatch("ms", average(frameTimeValues).toFixed(3));
			}
		}
	}
}
