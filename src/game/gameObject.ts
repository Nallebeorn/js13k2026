export interface GameObject {
	process: () => void;
}

export const gameObjects: GameObject[] = [];
