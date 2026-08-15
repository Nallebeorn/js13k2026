import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { rm, stat } from "node:fs/promises";
import type { Plugin } from "vite";

const execFileAsync = promisify(execFile);

export function zipDist(): Plugin {
	return {
		name: "zip-dist",

		apply: "build",

		async writeBundle() {
			await rm("dist.zip", { force: true });

			await execFileAsync(
				"zip",
				["-r", "-9", "../dist.zip", "."],
				{ cwd: "dist" },
			);

			const { size } = await stat("dist.zip");

			const sizeLimit = 13312;
			const sizeKb = Math.floor(size / 1024);
			const sizeKbRemainder = size % 1024;
			const sizeLimitKb = sizeLimit / 1024;
			console.log(`\nZIP size: ${size.toLocaleString()}/${sizeLimit.toLocaleString()} bytes (${sizeKb.toLocaleString()}KB ${sizeKbRemainder}B/${sizeLimitKb}KB)`);

			const percentageUsed = size / sizeLimit * 100;
			console.log(`Used: ${percentageUsed.toLocaleString()}%`);

			const remaining = sizeLimit - size;
			const remainingKb = Math.floor(Math.abs(remaining) / 1024);
			const remainingKbRemainder = Math.abs(remaining) % 1024;
			console.log(`Remaining: ${remaining.toLocaleString()} bytes (${remainingKb.toLocaleString()}KB ${remainingKbRemainder}B)`)

			if (size > sizeLimit) {
				console.error("Exceeding size limit!\n");
			} else {
				console.log("All good!\n");
			}
		},
	};
}
