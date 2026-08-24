import { advanceTime } from "./core/time.ts";
import { average, ringPush } from "./core/util.ts";
import { DEBUG } from "./debug.ts";
import { processFrame } from "./game/gameLoop.ts";
import { clearFrameInputs, isKeyHeld } from "./input/input.ts";
import { finishFrame, loadResources, setupFrame } from "./rendering/renderer.ts";

if (DEBUG) {
	console.log("ℹ️ DEBUG BUILD");
	var debugDiv = document.body.appendChild(document.createElement("div"));
	debugDiv.style = "color: yellow; font-family: monospace";
}



const fpsValues: number[] = [];
const frameTimeValues: number[] = [];
let framesRendered = 0;


// loadResources().then(() => {
	// requestAnimationFrame(onAnimationFrame);
// })

let previouseFrameTimestamp: number | undefined;
let timerAccumulator = 1000/60;

requestAnimationFrame(onAnimationFrame);

function onAnimationFrame(timestamp: number) {
	const elapsed = timestamp - (previouseFrameTimestamp ?? timestamp);
	previouseFrameTimestamp = timestamp;
	timerAccumulator += Math.min(elapsed, 100);

	if (timerAccumulator >= 1000 / 60) {
		timerAccumulator -= 1000 / 60;
		setupFrame();
		finishFrame();
	}

	requestAnimationFrame(onAnimationFrame);
}
