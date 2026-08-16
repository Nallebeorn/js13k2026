import { DEBUG } from "./debug.ts";
import { consumeInput, initInput, isKeyHeld, wasKeyJustPressed, wasKeyJustReleased } from "./input/input.ts";
import { render as renderScene } from "./rendering/renderer.ts";

if (DEBUG) {
	console.log("ℹ️ DEBUG BUILD");
	var debugDiv = document.body.appendChild(document.createElement("div"));
	debugDiv.style = "color: yellow;";
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
		timerAccumulator -= 1000 / 60;

		renderScene();
		if (DEBUG) {
			if (wasKeyJustPressed("Space")) {
				console.log("Pressed space!");
			}
			if (wasKeyJustReleased("Space")) {
				console.log("Released space!");
			}
			const fps = 1000 / elapsed;
			debugDiv.textContent = `${Math.round(fps)} | Space held: ${isKeyHeld("Space")}`;
		}
		consumeInput();
	}

}

requestAnimationFrame(onAnimationFrame);
