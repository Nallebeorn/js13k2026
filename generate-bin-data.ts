import { mkdir, readFile, writeFile } from "fs/promises";
import { serializeObjects } from "./src/gamedata/binwriter.ts";
import { existsSync } from "fs";

const t0 = performance.now();

mkdir("public", { recursive: true });
const { buffer, names, slotNames, sections } = serializeObjects();
const nameConstants = names
	.map((name, idx) => `export const obj_${name} = ${idx};`)
	.join("\n");
const nameConstantsUnion = names.map(name => `typeof obj_${name}`).join(" | ");

const slotNameConstants = Object.entries(slotNames)
	.flatMap(
		([object, slots]) => Object.entries(slots)
			.map(([slot, idx]) => `export const obj_${object}_${slot}Slot = ${idx};`),
).join("\n");

const constantsFileOutput =
`${nameConstants}
export type RenderObjectHandle = ${nameConstantsUnion};

${slotNameConstants}
`;

const sectionConstants = sections.entries().map(([section, offset]) =>
	`export const section_${section}End = ${offset};`
).toArray().join("\n");

writeFile("public/b", Buffer.from(buffer));
writeFileIfChanged("src/gamedata/objects.gen.ts", constantsFileOutput);
writeFileIfChanged("src/gamedata/sections.gen.ts", sectionConstants);
const t1 = performance.now();
console.log(`[${getTimestamp()}] Regenerated binary data file: ${buffer.byteLength}B (${names.length} objects)`);
console.log(`Time: ${(t1 - t0).toFixed(2)}ms`);

function getTimestamp(): string {
	return new Date().toLocaleTimeString(
		[],
		{
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			fractionalSecondDigits: 2,
		}
	);
}

async function writeFileIfChanged(file: string, contents: string) {
	if (!existsSync(file) || contents !== await readFile(file, "utf8")) {
		return writeFile(file, contents);
	}
}
