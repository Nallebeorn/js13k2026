import "geometry-interfaces"; // polyfill DOMMatrix
import { mkdir, writeFile } from "fs/promises";
import { serializeObjects } from "./src/gamedata/binwriter.ts";

mkdir("public", { recursive: true });
writeFile("public/g.bin", Buffer.from(serializeObjects()));
