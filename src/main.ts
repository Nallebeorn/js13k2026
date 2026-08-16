import { DEBUG } from "./debug.ts";
import { consumeInput, initInput, isKeyHeld, wasKeyJustPressed, wasKeyJustReleased } from "./input/input.ts";
import { render as renderScene } from "./rendering/renderer.ts";

if (DEBUG) {
	console.log("ℹ️ DEBUG BUILD");
	var debugDiv = document.body.appendChild(document.createElement("div"));
	debugDiv.style = "color: yellow; font-family: monospace";
}

let previouseFrameTimestamp = 0;
let timerAccumulator = 0;

initInput();

function onAnimationFrame(timestamp: number) {
	requestAnimationFrame(onAnimationFrame);

	const elapsed = timestamp - previouseFrameTimestamp || timestamp;
	previouseFrameTimestamp = timestamp;
	timerAccumulator += elapsed;

	while (timerAccumulator >= 1000 / 60) {
		const start = (DEBUG && performance.now()) as number;
		timerAccumulator -= 1000 / 60;

		renderScene();
		consumeInput();
		if (DEBUG) {
			const fps = 1000 / elapsed;
			const frameDuration = performance.now() - start;
			debugDiv.textContent = `${Math.round(fps)} | ${frameDuration.toFixed(2)}ms | Space held: ${isKeyHeld("Space")}`;
		}
	}
}

requestAnimationFrame(onAnimationFrame);
