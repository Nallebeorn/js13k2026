import type { Transform } from "../core/math.ts";
import type { Color } from "../gamedata/colors.ts";
import type { ObjectInfo } from "./renderer.ts";

export interface DrawCommand {
	pushTransform?: Transform;
	popTransform?: 1;

	drawShape?: ObjectInfo;
	colour?: Color;
	incrementSurfaceIndex?: 0 | number;
}
