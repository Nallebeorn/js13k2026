import type { Vec4 } from "../core/math.ts";
import type { ObjectInfo } from "./renderer.ts";

export interface DrawCommand {
	pushTransform?: DOMMatrix;
	popTransform?: 1;

	drawShape?: ObjectInfo;
	color?: Vec4;
	incrementSurfaceIndex?: 0 | number;
}
