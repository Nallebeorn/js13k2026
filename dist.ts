import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { stat, rm } from "node:fs/promises";

const execFileAsync = promisify(execFile);

async function runProcess(...args: Parameters<typeof execFileAsync>) {
	const { stdout, stderr } = await execFileAsync(...args);
	console.log(stdout);
	console.error(stderr);
}

await runProcess("pnpm", ["build"], {});

await rm("dist.zip", {force: true});

await runProcess(
	"zip",
	["-r", "-9", "../dist.zip", "."],
	{
		cwd: "dist"
	}
);


const { size } = await stat("dist.zip");

const sizeLimit = 13312;
const sizeKb = Math.floor(size / 1024);
const sizeKbRemainder = size % 1024;
const sizeLimitKb = sizeLimit / 1024;
console.log(`ZIP size: ${size.toLocaleString()}/${sizeLimit.toLocaleString()} bytes (${sizeKb.toLocaleString()}KB ${sizeKbRemainder}B/${sizeLimitKb}KB)`);

const percentageUsed = size / sizeLimit * 100;
console.log(`Used: ${percentageUsed.toLocaleString()}%`);

const remaining = sizeLimit - size;
const remainingKb = Math.floor(Math.abs(remaining) / 1024);
const remainingKbRemainder = Math.abs(remaining) % 1024;
console.log(`Remaining: ${remaining.toLocaleString()} bytes (${remainingKb.toLocaleString()}KB ${remainingKbRemainder}B)`)

if (size > sizeLimit) {
	console.error("Exceeding size limit!");
	process.exit(1);
} else {
	console.log("All good!");
}
