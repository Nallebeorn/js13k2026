import { mkdir, writeFile } from "fs/promises";
import { serializeObjects } from "./src/gamedata/binwriter.ts";

mkdir("public", { recursive: true });
const { buffer, names, slotNames } = serializeObjects();
const nameConstants = names
	.map((name, idx) => `export const obj_${name} = ${idx};`)
	.join("\n");

const slotNameConstants = Object.entries(slotNames)
	.flatMap(
		([object, slots]) => Object.entries(slots)
			.map(([slot, idx]) => `export const obj_${object}_${slot}Slot = ${idx};`),
).join("\n");

console.log(`Generated g.bin: ${buffer.byteLength}B (${names.length} objects)`);
writeFile("public/g.bin", Buffer.from(buffer));
writeFile("src/gamedata/objects.gen.ts", nameConstants + "\n\n" + slotNameConstants);
