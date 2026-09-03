import type { Collider } from "./collision.ts";

export let objectColliders: Collider[] = [];

export const resetObjectColliders = () => {
	objectColliders = [];
}
