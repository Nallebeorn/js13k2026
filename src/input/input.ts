import type { KeyCode } from "./keycode.ts";

const pressed: KeyCode[] = [];
// const released: KeyCode[] = [];
const held = new Set<KeyCode>();

export let mouseDeltaX = 0, mouseDeltaY = 0;

export function initInput() {
	onkeydown = (event: KeyboardEvent) => {
		if (!event.repeat) {
			pressed.push(event.code as KeyCode);
			held.add(event.code as KeyCode);
		}
	};

	onkeyup = (event: KeyboardEvent) => {
		// released.push(event.code as KeyCode);
		held.delete(event.code as KeyCode);
	};

	document.onpointerlockchange = () => {
		// held.forEach(heldKey => released.push(heldKey));
		held.clear();
	}

	canvas.onclick = () => {
		canvas.requestPointerLock();
	};

	canvas.onmousemove = (event: MouseEvent) => {
		if (document.pointerLockElement != canvas) return;
		mouseDeltaX += event.movementX;
		mouseDeltaY += event.movementY;
	};
}


export function consumeInput() {
	pressed.splice(0);
	// released.splice(0);
	mouseDeltaX = 0;
	mouseDeltaY = 0;
}

export function isKeyHeld(code: KeyCode): (0 | 1) {
	return +held.has(code) as (0 | 1);
}

export function wasKeyJustPressed(code: KeyCode) {
	return pressed.includes(code);
}

// export function wasKeyJustReleased(code: KeyCode) {
	// return released.includes(code);
// }
