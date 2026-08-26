export const DEBUG = import.meta.env.DEV;

let debugDiv: HTMLElement;

if (DEBUG) {
	debugDiv = document.body.appendChild(document.createElement("div"));
	debugDiv.style = /*css*/`
		color: yellow;
		font-family: monospace;
	`;
}

const watches: Record<string, any> = {}

export function debugWatch(key: string, value: any) {
	if (DEBUG) {
		watches[key] = value;
		debugDiv.innerHTML = Object.entries(watches).map(([k, v]) => `${k}: ${v}`).join(" | ");
	}
}
