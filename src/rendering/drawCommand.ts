import type { Transform } from "../core/math.ts";
import type { Color } from "../gamedata/colors.ts";
import type { MeshInfo } from "./renderer.ts";

export interface DrawCommand {
	pushTransform?: Transform;
	popTransform?: 1;

	drawShape?: MeshInfo;
	colour?: Color;
	incrementSurfaceIndex?: 0 | number;
}
