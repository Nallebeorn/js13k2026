export const delta = 1 / 60;
export let time = 0;

export function advanceTime() {
	time += delta;
}
