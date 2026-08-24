import { advanceTime } from "./core/time.ts";
import { average, ringPush } from "./core/util.ts";
import { DEBUG } from "./debug.ts";
import { processFrame } from "./game/gameLoop.ts";
import { clearFrameInputs, isKeyHeld } from "./input/input.ts";
import { finishFrame, loadAssets, setupFrame } from "./rendering/renderer.ts";

if (DEBUG) {
	console.log("ℹ️ DEBUG BUILD");
	var debugDiv = document.body.appendChild(document.createElement("div"));
	debugDiv.style = "color: yellow; font-family: monospace";
}

let previouseFrameTimestamp: number | undefined;
let timerAccumulator = 1000/60;

const fpsValues: number[] = [];
const frameTimeValues: number[] = [];
let framesRendered = 0;

let loaded = false;
loadAssets().then(() => loaded = true);

requestAnimationFrame(onAnimationFrame);

function onAnimationFrame(timestamp: number) {
	requestAnimationFrame(onAnimationFrame);

	const elapsed = timestamp - (previouseFrameTimestamp ?? timestamp);
	previouseFrameTimestamp = timestamp;
	timerAccumulator += elapsed;

	while (timerAccumulator >= 1000 / 60) {
		const t0 = (DEBUG && performance.now()) as number;
		timerAccumulator -= 1000 / 60;

		setupFrame();
		if (loaded) {
			processFrame();
			advanceTime();
		}
		finishFrame();
		clearFrameInputs();
		if (DEBUG) {
			const fps = 1000 / elapsed;
			const t1 = performance.now();
			ringPush(frameTimeValues, t1 - t0, 20);
			if (framesRendered++ % 10 == 0) {
				debugDiv.textContent = `${Math.round(fps)} | ${average(frameTimeValues).toFixed(3)}ms | Space held: ${isKeyHeld("Space")}`;
			}
		}
	}
}
