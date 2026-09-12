import { shardsCollected } from "../game/rainbowShards.ts";
import { currentTime } from "./time.ts";

let speedrunTimer = 0;
let bestTime = +localStorage.getItem("unifrostBest")!;

export function processSpeedrunTimer() {
	timers.hidden = !bestTime;
	if (shardsCollected < 7) {
		speedrunTimer = currentTime;
	}
	curTimer.innerText = formatTime(speedrunTimer);
	bestTimer.innerText = formatTime(bestTime);
}

export function saveBestTime() {
	bestTime = bestTime ? Math.min(bestTime, speedrunTimer) : speedrunTimer;
	localStorage.setItem("unifrostBest", bestTime as unknown as string);
}

function formatTime(seconds: number) {
  const mins = (seconds / 60) | 0;
  const secs = seconds % 60;

  return `${(""+mins).padStart(2, '0')}:${secs.toFixed(3).padStart(6, '0')}`;
}
