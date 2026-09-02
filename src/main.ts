import { advanceTime } from "./core/time.ts";
import { average, ringPush } from "./core/util.ts";
import { DEBUG, debugWatch } from "./debug.ts";
import { say } from "./game/dialogue.ts";
import { processFrame } from "./game/gameLoop.ts";
import { clearFrameInputs, isKeyHeld } from "./input/input.ts";
import { finishFrame, setupFrame } from "./rendering/renderer.ts";

if (DEBUG) {
	console.log("ℹ️ DEBUG BUILD");
}

let previouseFrameTimestamp = 0;
let timerAccumulator = 0;

const fpsValues: number[] = [];
const frameTimeValues: number[] = [];
let framesRendered = 0;

requestAnimationFrame(onAnimationFrame);

say("");

function onAnimationFrame(timestamp: number) {
	requestAnimationFrame(onAnimationFrame);

	const elapsed = timestamp - previouseFrameTimestamp || timestamp;
	previouseFrameTimestamp = timestamp;
	timerAccumulator = Math.min(timerAccumulator + elapsed, 1000);

	while (timerAccumulator >= 1000 / 60) {
		const t0 = (DEBUG && performance.now()) as number;
		timerAccumulator -= 1000 / 60;

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
				debugWatch("Space held", isKeyHeld("Space"));
			}
		}
	}
}
