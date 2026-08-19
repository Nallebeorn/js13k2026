import type { ObjectInfo } from "./renderer.ts";

export interface DrawCommand {
	pushTransform?: DOMMatrix;
	popTransform?: 1;

	drawShape?: ObjectInfo;
	color?: number;
	incrementSurfaceIndex?: 0 | number;
}
