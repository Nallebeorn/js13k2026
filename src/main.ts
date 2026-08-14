import { DEBUG } from "./debug.ts";
import { render as renderScene } from "./rendering/renderer.ts";

if (DEBUG) {
	console.log("ℹ️ DEBUG BUILD");
	var debugDiv = document.body.appendChild(document.createElement("div"));
	debugDiv.style = "color: yellow;";
}

let previouseFrameTimestamp = 0;
let timerAccumulator = 0;

function onAnimationFrame(timestamp: number) {
	requestAnimationFrame(onAnimationFrame);

	const elapsed = timestamp - previouseFrameTimestamp || timestamp;
	previouseFrameTimestamp = timestamp;
	timerAccumulator += elapsed;

	while (timerAccumulator >= 1000 / 60) {
		timerAccumulator -= 1000 / 60;

		renderScene();
		if (DEBUG) {
			const fps = 1000 / elapsed;
			debugDiv.textContent = Math.round(fps).toString();
		}
	}
}

requestAnimationFrame(onAnimationFrame);
