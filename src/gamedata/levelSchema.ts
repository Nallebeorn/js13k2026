import type { Vec2, Vec3 } from "../core/math.ts";
import type { RenderObjectHandle } from "./objects.gen.ts";

export const CLOUD = "cloud";
export const NPC = "npc";
type Cloud = [type: typeof CLOUD, y: number, min: Vec2, max: Vec2];
type Npc = [type: typeof NPC, obj: RenderObjectHandle, pos: Vec3, angle: number, say: string];
type LevelObject = [type: RenderObjectHandle, pos: Vec3, euler?: Vec3];

type LevelNode = Cloud | Npc | LevelObject;

export type LevelDescriptor = LevelNode[];
