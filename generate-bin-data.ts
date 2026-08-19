import "geometry-interfaces"; // polyfill DOMMatrix
import { mkdir, writeFile } from "fs/promises";
import { serializeObjects } from "./src/gamedata/binwriter.ts";

mkdir("public", { recursive: true });
const data = Buffer.from(serializeObjects());
console.log(`Generated g.bin: ${data.byteLength}B`);
writeFile("public/g.bin", data);
