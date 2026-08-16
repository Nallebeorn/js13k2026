import type { KeyCode } from "./keycode.ts";

const pressed: KeyCode[] = [];
const released: KeyCode[] = [];
const held = new Set<KeyCode>();

let lastMouseX: number, lastMouseY: number;
let currentMouseX: number, currentMouseY: number;

let mouseDeltaX = 0, mouseDeltaY = 0;

export function initInput() {
	addEventListener("keydown", (event: KeyboardEvent) => {
		if (!event.repeat) {
			pressed.push(event.code as KeyCode);
			held.add(event.code as KeyCode);
		}
	});

	addEventListener("keyup", (event: KeyboardEvent) => {
		released.push(event.code as KeyCode);
		held.delete(event.code as KeyCode);
	});

	canvas.addEventListener("click", async () => {
		try {
			await canvas.requestPointerLock({ unadjustedMovement: true });
		} catch (e) {
			await canvas.requestPointerLock();
		}
	});

	canvas.addEventListener("mousemove", (event: MouseEvent) => {
		if (document.pointerLockElement != canvas) return;
		mouseDeltaX += event.movementX;
		mouseDeltaY += event.movementY;
	});
}


export function consumeInput() {
	pressed.splice(0);
	released.splice(0);
	mouseDeltaX = 0;
	mouseDeltaY = 0;
}

export function isKeyHeld(code: KeyCode): (0 | 1) {
	return +held.has(code) as (0 | 1);
}

export function wasKeyJustPressed(code: KeyCode) {
	return pressed.includes(code);
}

export function wasKeyJustReleased(code: KeyCode) {
	return released.includes(code);
}

export function getMouseDeltaX() {
	return mouseDeltaX;
}

export function getMouseDeltaY() {
	return mouseDeltaY;
}
