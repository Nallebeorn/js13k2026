import { currentTime } from "../core/time.ts";
import type { KeyCode } from "./keycode.ts";

let pressedTimestamp: Record<string, number> = {};

export let mouseDeltaX = 0, mouseDeltaY = 0;

onkeydown = (event: KeyboardEvent) => {
	if (!event.repeat) {
		pressedTimestamp[event.code] = currentTime;
	}
};

onkeyup = (event: KeyboardEvent) => {
	pressedTimestamp[event.code] = 0;
};

document.onpointerlockchange = () => {
	pressedTimestamp = {};
}

document.body.onclick = () => {
	if (document.pointerLockElement != document.body) {
		document.body.requestPointerLock();
	}
};

document.body.onmousemove = (event: MouseEvent) => {
	if (document.pointerLockElement == document.body) {
		mouseDeltaX += event.movementX;
		mouseDeltaY += event.movementY;
	}
};

export function clearFrameInputs() {
	mouseDeltaX = mouseDeltaY = 0;
}

export function isKeyHeld(code: KeyCode): (0 | 1) {
	return pressedTimestamp[code] ? 1 : 0;
}

export function wasKeyJustPressed(code: KeyCode) {
	return pressedTimestamp[code] == currentTime;
}
