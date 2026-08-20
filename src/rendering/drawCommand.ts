import type { Color } from "../gamedata/colors.ts";
import type { ObjectInfo } from "./renderer.ts";

export type Scene = DrawCommand[];

export interface DrawCommand {
	pushTransform?: DOMMatrix;
	popTransform?: 1;

	drawShape?: ObjectInfo;
	color?: Color;
	incrementSurfaceIndex?: 0 | number;
}
