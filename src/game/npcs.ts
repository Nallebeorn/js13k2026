import { angleFromDirection, length, rotateTowards, sub, type Vec3 } from "../core/math.ts";
import { deltaTime } from "../core/time.ts";
import type { RenderObjectHandle } from "../gamedata/objects.gen.ts";
import { drawObject } from "../rendering/renderer.ts";
import { say } from "./dialogue.ts";
import { getPlayerPos } from "./player.ts";

export interface Npc {
	obj: RenderObjectHandle,
	pos: Vec3,
	angle: number,
	dialogue: string,
}
export const npcs: Npc[] = [];

export function processNpcs() {
	let dialogue = "";
	for (const npc of npcs) {
		const toPlayer = sub(npc.pos, getPlayerPos());
		if (length(toPlayer) < 7) {
			dialogue = npc.dialogue;
			npc.angle = rotateTowards(npc.angle, angleFromDirection(toPlayer[0], toPlayer[2]), deltaTime * 720)
		}

		drawObject(npc.obj, {
			_: { translation: npc.pos, euler: [0, npc.angle, 0] },
		});

	}

	say(dialogue);
}
